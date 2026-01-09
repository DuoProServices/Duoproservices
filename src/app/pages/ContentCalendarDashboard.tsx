import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Image, FileText, Eye, Edit, Trash2, Plus, Filter, ArrowLeft, X, Copy, Check, Upload } from "lucide-react";
import { januaryPosts } from "../data/contentCalendar";
import type { ContentPost } from "../data/contentCalendar";
import { copyToClipboard } from "../utils/clipboard";

export function ContentCalendarDashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<ContentPost[]>(januaryPosts);
  const [filterFormat, setFilterFormat] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<ContentPost | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [editForm, setEditForm] = useState<{
    owner: string;
    status: ContentPost["status"];
    publishDate: string;
    file: string;
    observations: string;
  }>({
    owner: "",
    status: "Em análise",
    publishDate: "",
    file: "",
    observations: ""
  });

  const getStatusColor = (status: ContentPost["status"]) => {
    const colors = {
      "Em análise": "bg-yellow-100 text-yellow-800 border-yellow-300",
      "Em execução": "bg-orange-100 text-orange-800 border-orange-300",
      "Publicada": "bg-pink-100 text-pink-800 border-pink-300",
      "Suspenso": "bg-red-100 text-red-800 border-red-300",
      "Pausado": "bg-green-100 text-green-800 border-green-300"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getFormatColor = (format: ContentPost["format"]) => {
    const colors = {
      "Estático": "bg-blue-100 text-blue-800 border-blue-300",
      "Reels": "bg-pink-100 text-pink-800 border-pink-300",
      "Carrossel": "bg-purple-100 text-purple-800 border-purple-300",
      "Story": "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300",
      "Foto": "bg-indigo-100 text-indigo-800 border-indigo-300"
    };
    return colors[format] || "bg-gray-100 text-gray-800";
  };

  const handleCreateImage = (post: ContentPost) => {
    navigate(`/admin/marketing-dashboard?templateId=${post.templateId}&postId=${post.id}`);
  };

  const handleBackToHub = () => {
    navigate("/admin");
  };

  const handleViewDetails = (post: ContentPost) => {
    setSelectedPost(post);
  };

  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleEdit = (post: ContentPost) => {
    setEditingPost(post);
    setEditForm({
      owner: post.owner,
      status: post.status,
      publishDate: post.publishDate || "",
      file: post.file || "",
      observations: post.observations
    });
  };

  const handleSaveEdit = () => {
    if (!editingPost) return;

    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === editingPost.id
          ? {
              ...p,
              owner: editForm.owner,
              status: editForm.status,
              publishDate: editForm.publishDate,
              file: editForm.file,
              observations: editForm.observations
            }
          : p
      )
    );

    setEditingPost(null);
    setEditForm({
      owner: "",
      status: "Em análise",
      publishDate: "",
      file: "",
      observations: ""
    });
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setEditForm({
      owner: "",
      status: "Em análise",
      publishDate: "",
      file: "",
      observations: ""
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingFile(true);
      // Simular upload - em produção, fazer upload para Supabase Storage
      setTimeout(() => {
        setEditForm({ ...editForm, file: file.name });
        setUploadingFile(false);
      }, 1000);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filterFormat !== "all" && post.format !== filterFormat) return false;
    if (filterStatus !== "all" && post.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToHub}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para Admin Hub
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-2 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-orange-600" />
                Calendário de Conteúdo - Janeiro 2025
              </h1>
              <p className="text-gray-600">
                Gerencie e crie imagens para suas campanhas de marketing
              </p>
            </div>
            
            <button
              onClick={() => navigate("/admin/marketing-dashboard")}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Novo Post
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>
          
          <select
            value={filterFormat}
            onChange={(e) => setFilterFormat(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">Todos os formatos</option>
            <option value="Estático">Estático</option>
            <option value="Reels">Reels</option>
            <option value="Carrossel">Carrossel</option>
            <option value="Story">Story</option>
            <option value="Foto">Foto</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">Todos os status</option>
            <option value="Em análise">Em análise</option>
            <option value="Em execução">Em execução</option>
            <option value="Publicada">Publicada</option>
            <option value="Suspenso">Suspenso</option>
            <option value="Pausado">Pausado</option>
          </select>

          <div className="ml-auto text-sm text-gray-600">
            {filteredPosts.length} posts encontrados
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data da Postagem
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Formato
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tema do Post
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proprietário
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data da Publicação
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Arquivo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Observações
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {post.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getFormatColor(post.format)}`}>
                        {post.format}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      {post.theme}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                          👤
                        </div>
                        {post.owner}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.publishDate || "dd/mm/yyyy"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.file || (
                        <span className="flex items-center gap-1 text-gray-400">
                          <FileText className="w-4 h-4" />
                          Arquivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {post.observations}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCreateImage(post);
                          }}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer relative z-10"
                          title="Criar imagem"
                          type="button"
                        >
                          <Image className="w-5 h-5 pointer-events-none" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(post);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer relative z-10"
                          title="Ver detalhes"
                          type="button"
                        >
                          <Eye className="w-5 h-5 pointer-events-none" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(post);
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer relative z-10"
                          title="Editar"
                          type="button"
                        >
                          <Edit className="w-5 h-5 pointer-events-none" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Nenhum post encontrado
            </h3>
            <p className="text-gray-500 mb-6">
              Ajuste os filtros ou crie um novo post
            </p>
            <button
              onClick={() => navigate("/admin/marketing-dashboard")}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Criar Novo Post
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-400">
            <div className="text-sm text-gray-600 mb-1">Em análise</div>
            <div className="text-2xl font-semibold">
              {posts.filter(p => p.status === "Em análise").length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-400">
            <div className="text-sm text-gray-600 mb-1">Em execução</div>
            <div className="text-2xl font-semibold">
              {posts.filter(p => p.status === "Em execução").length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-pink-400">
            <div className="text-sm text-gray-600 mb-1">Publicada</div>
            <div className="text-2xl font-semibold">
              {posts.filter(p => p.status === "Publicada").length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-400">
            <div className="text-sm text-gray-600 mb-1">Suspenso</div>
            <div className="text-2xl font-semibold">
              {posts.filter(p => p.status === "Suspenso").length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-400">
            <div className="text-sm text-gray-600 mb-1">Pausado</div>
            <div className="text-2xl font-semibold">
              {posts.filter(p => p.status === "Pausado").length}
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{selectedPost.theme}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedPost.date} • {selectedPost.format}
                </p>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Slides */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center justify-between">
                  Slides / Texto da Imagem
                  <button
                    onClick={() => handleCopy(selectedPost.slides.join("\n\n"), "slides")}
                    className="text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                  >
                    {copiedField === "slides" ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copiar
                      </>
                    )}
                  </button>
                </h3>
                <div className="space-y-3">
                  {selectedPost.slides.map((slide, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Slide {index + 1}</div>
                      <div className="font-medium">{slide}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Caption EN */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center justify-between">
                  Legenda (English)
                  <button
                    onClick={() => handleCopy(selectedPost.caption.en, "caption-en")}
                    className="text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                  >
                    {copiedField === "caption-en" ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copiar
                      </>
                    )}
                  </button>
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 whitespace-pre-wrap">
                  {selectedPost.caption.en}
                </div>
              </div>

              {/* Caption FR */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center justify-between">
                  Legenda (Français)
                  <button
                    onClick={() => handleCopy(selectedPost.caption.fr, "caption-fr")}
                    className="text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                  >
                    {copiedField === "caption-fr" ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copiar
                      </>
                    )}
                  </button>
                </h3>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 whitespace-pre-wrap">
                  {selectedPost.caption.fr}
                </div>
              </div>

              {/* Hashtags */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center justify-between">
                  Hashtags
                  <button
                    onClick={() => handleCopy(selectedPost.hashtags.join(" "), "hashtags")}
                    className="text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                  >
                    {copiedField === "hashtags" ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copiar
                      </>
                    )}
                  </button>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPost.hashtags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Call to Action</h3>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="font-medium text-orange-900">{selectedPost.cta}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => handleCreateImage(selectedPost)}
                  className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Image className="w-5 h-5" />
                  Criar Imagem
                </button>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Editar Post</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {editingPost.theme} • {editingPost.date}
                </p>
              </div>
              <button
                onClick={handleCancelEdit}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Owner */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proprietário *
                </label>
                <input
                  type="text"
                  value={editForm.owner}
                  onChange={(e) => setEditForm({ ...editForm, owner: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Nome do responsável"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as ContentPost["status"] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Em análise">Em análise</option>
                  <option value="Em execução">Em execução</option>
                  <option value="Publicada">Publicada</option>
                  <option value="Suspenso">Suspenso</option>
                  <option value="Pausado">Pausado</option>
                </select>
              </div>

              {/* Publish Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data da Publicação
                </label>
                <input
                  type="date"
                  value={editForm.publishDate}
                  onChange={(e) => setEditForm({ ...editForm, publishDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* File/URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arquivo / URL
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.file}
                    onChange={(e) => setEditForm({ ...editForm, file: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="URL do arquivo ou nome do arquivo"
                  />
                  
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-xs text-gray-500">ou</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                  
                  <div>
                    <label
                      htmlFor="file-upload"
                      className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                        uploadingFile
                          ? 'border-orange-300 bg-orange-50'
                          : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                      }`}
                    >
                      {uploadingFile ? (
                        <>
                          <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-orange-700">Carregando arquivo...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-gray-600" />
                          <span className="text-sm text-gray-700 font-medium">Anexar Imagem</span>
                        </>
                      )}
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                  
                  {editForm.file && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-green-800 truncate">{editForm.file}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Observations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  value={editForm.observations}
                  onChange={(e) => setEditForm({ ...editForm, observations: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={4}
                  placeholder="Notas e observações sobre este post..."
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">Campos editáveis:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-800">
                      <li>Proprietário (quem é responsável)</li>
                      <li>Status do post</li>
                      <li>Data de publicação</li>
                      <li>Link/nome do arquivo</li>
                      <li>Observações</li>
                    </ul>
                    <p className="mt-2 text-xs">
                      Os textos, legendas e hashtags não são editáveis aqui.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Salvar Alterações
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}