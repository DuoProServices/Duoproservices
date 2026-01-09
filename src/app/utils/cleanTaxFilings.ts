/**
 * Utility to clean corrupted tax filings data
 * Run this once in the console to fix corrupted data in Supabase
 */

import { supabase } from './supabaseClient';

export async function cleanUserTaxFilings() {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data?.user) {
      console.error('❌ Error getting user:', error);
      return;
    }

    const userId = data.user.id;
    const currentFilings = data.user.user_metadata?.taxFilings || [];
    
    console.log('🔍 Current tax filings:', currentFilings);
    
    // Filter out corrupted filings
    const cleanFilings = currentFilings.filter((filing: any) => {
      // Must have year, status, createdAt, updatedAt
      if (!filing || typeof filing !== 'object') return false;
      if (!filing.year || typeof filing.year !== 'number') return false;
      if (!filing.status) return false;
      if (!filing.createdAt) return false;
      if (!filing.updatedAt) return false;
      
      // Reject if ONLY has pricingPresetId and year
      const keys = Object.keys(filing);
      if (keys.length === 2 && keys.includes('pricingPresetId') && keys.includes('year')) {
        console.warn('⚠️ Removing corrupted filing:', filing);
        return false;
      }
      
      return true;
    });
    
    console.log('✅ Clean filings:', cleanFilings);
    
    // Update user metadata with clean filings
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        taxFilings: cleanFilings
      }
    });
    
    if (updateError) {
      console.error('❌ Error updating user:', updateError);
      return;
    }
    
    console.log('✅ Tax filings cleaned successfully!');
    console.log(`📊 Removed ${currentFilings.length - cleanFilings.length} corrupted filing(s)`);
    console.log('🔄 Please refresh the page.');
    
    return cleanFilings;
    
  } catch (error) {
    console.error('❌ Error cleaning tax filings:', error);
  }
}

// Run in browser console:
// import { cleanUserTaxFilings } from './utils/cleanTaxFilings';
// cleanUserTaxFilings();
