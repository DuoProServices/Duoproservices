/**
 * UTILITY TO FIX CORRUPTED TAX FILINGS
 * 
 * This utility fixes tax filings where the `year` field is an object instead of a number
 * Example of corrupted data: { year: { pricingPresetId: "...", year: 2025 } }
 * Should be: { year: 2025 }
 */

import { supabase } from '../utils/supabaseClient';

interface CorruptedTaxFiling {
  year: any; // Can be number or object
  status: string;
  createdAt: string;
  updatedAt: string;
  payment?: any;
  [key: string]: any;
}

/**
 * Fix corrupted tax filings for a specific user
 */
export async function fixUserTaxFilings(userId: string): Promise<{
  success: boolean;
  fixed: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let fixedCount = 0;

  try {
    console.log(`🔧 Starting fix for user ${userId}...`);

    // Get user metadata
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !userData?.user) {
      throw new Error(`User not found: ${userId}`);
    }

    const metadata = userData.user.user_metadata || {};
    const taxFilings: CorruptedTaxFiling[] = metadata.taxFilings || [];

    if (taxFilings.length === 0) {
      console.log('✅ No tax filings to fix');
      return { success: true, fixed: 0, errors: [] };
    }

    console.log(`📋 Found ${taxFilings.length} tax filings`);

    // Fix corrupted filings
    const fixedFilings = taxFilings.map((filing, index) => {
      // Check if year is an object (corrupted)
      if (typeof filing.year === 'object' && filing.year !== null) {
        console.warn(`⚠️ Found corrupted filing at index ${index}:`, filing);
        
        // Extract the actual year from the nested object
        const actualYear = filing.year.year;
        
        if (typeof actualYear === 'number') {
          console.log(`✅ Fixing: Extracting year ${actualYear} from object`);
          fixedCount++;
          
          // Create fixed filing
          const fixed = {
            ...filing,
            year: actualYear, // Extract the number
          };
          
          // If pricingPresetId was in the nested year object, preserve it in payment
          if (filing.year.pricingPresetId && !filing.payment) {
            fixed.payment = {
              ...filing.payment,
              pricingPresetId: filing.year.pricingPresetId,
              status: 'pending',
              amount: 0,
              currency: 'CAD',
              createdAt: filing.createdAt
            };
          }
          
          return fixed;
        } else {
          errors.push(`Filing at index ${index} has invalid year: ${JSON.stringify(filing.year)}`);
          return null; // Mark for removal
        }
      }
      
      // Check if year is a valid number
      if (typeof filing.year !== 'number' || isNaN(filing.year)) {
        console.warn(`⚠️ Invalid year type at index ${index}:`, typeof filing.year, filing.year);
        errors.push(`Filing at index ${index} has invalid year type: ${typeof filing.year}`);
        return null; // Mark for removal
      }
      
      // Filing is valid
      return filing;
    });

    // Remove null entries (invalid filings)
    const validFilings = fixedFilings.filter(f => f !== null);

    console.log(`📊 Results: ${validFilings.length} valid filings, ${fixedCount} fixed, ${errors.length} errors`);

    if (fixedCount > 0 || validFilings.length !== taxFilings.length) {
      // Update user metadata with fixed filings
      const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: {
          ...metadata,
          taxFilings: validFilings
        }
      });

      if (updateError) {
        throw new Error(`Failed to update user metadata: ${updateError.message}`);
      }

      console.log(`✅ Successfully updated user ${userId} with ${validFilings.length} valid filings`);
    }

    return {
      success: true,
      fixed: fixedCount,
      errors
    };

  } catch (error) {
    console.error('❌ Error fixing tax filings:', error);
    errors.push(error instanceof Error ? error.message : String(error));
    return {
      success: false,
      fixed: fixedCount,
      errors
    };
  }
}

/**
 * Fix corrupted tax filings for ALL users
 * WARNING: This is a destructive operation. Use with caution.
 */
export async function fixAllUsersTaxFilings(): Promise<{
  totalUsers: number;
  totalFixed: number;
  errors: string[];
}> {
  console.log('🔧 Starting fix for ALL users...');
  
  let totalFixed = 0;
  const allErrors: string[] = [];
  let processedUsers = 0;

  try {
    // Get all users (this requires admin access)
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      throw new Error(`Failed to list users: ${listError.message}`);
    }

    if (!users || users.length === 0) {
      console.log('✅ No users found');
      return { totalUsers: 0, totalFixed: 0, errors: [] };
    }

    console.log(`📋 Found ${users.length} users to process`);

    // Process each user
    for (const user of users) {
      const result = await fixUserTaxFilings(user.id);
      processedUsers++;
      totalFixed += result.fixed;
      allErrors.push(...result.errors);
      
      if (result.fixed > 0) {
        console.log(`✅ User ${user.email}: Fixed ${result.fixed} filings`);
      }
    }

    console.log(`\n📊 FINAL RESULTS:`);
    console.log(`   Processed: ${processedUsers} users`);
    console.log(`   Fixed: ${totalFixed} corrupted filings`);
    console.log(`   Errors: ${allErrors.length}`);

    return {
      totalUsers: processedUsers,
      totalFixed,
      errors: allErrors
    };

  } catch (error) {
    console.error('❌ Error in fixAllUsersTaxFilings:', error);
    allErrors.push(error instanceof Error ? error.message : String(error));
    return {
      totalUsers: processedUsers,
      totalFixed,
      errors: allErrors
    };
  }
}
