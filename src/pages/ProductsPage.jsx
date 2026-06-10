import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ShoppingBag, Pencil, Trash2, Package } from 'lucide-react'
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService'
import PageHeader from '../components/ui/PageHeader'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import ProductForm from '../components/products/ProductForm'
import { formatCurrency } from '../utils/format'

// ─────────────────────────────────────────────────────────────────────────
// CRUD 2 — PRODUTOS (lojinha do pet shop)
// Tabela responsiva com Create, Read, Update e Delete.
// ─────────────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  // ── Estado da página ──────────────────────────
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null) // produto em edição (ou null = novo)
  const [toDelete, setToDelete] = useState(null) // produto aguardando confirmação

  // ── READ: carrega o catálogo de produtos ──────
  const load = async () => {
    setLoading(true)
    setProducts(await listProducts())
    setLoading(false)
  }

  // ── Efeito: carrega ao montar a página ────────
  useEffect(() => {
    load()
  }, [])

  // ── CREATE / UPDATE: salva o formulário ───────
  const handleSave = async (data) => {
    if (editing) await updateProduct(editing.id, data)
    else await createProduct(data)
    setFormOpen(false)
    setEditing(null)
    load()
  }

  // ── DELETE: remove o produto selecionado ──────
  const handleDelete = async () => {
    await deleteProduct(toDelete.id)
    load()
  }

  // ── Abrir o modal de novo produto ─────────────
  const openNew = () => {
    setEditing(null)
    setFormOpen(true)
  }

  // ── Render ────────────────────────────────────
  return (
    <div>
      <PageHeader
        title="Produtos 🛍️"
        description="Gerencie o catálogo da lojinha do pet shop."
        action={
          <button onClick={openNew} className="btn-primary">
            <Plus size={18} /> Novo produto
          </button>
        }
      />

      {loading ? (
        <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />
      ) : products.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Nenhum produto cadastrado"
          description="Adicione produtos para montar o catálogo da loja."
          action={
            <button onClick={openNew} className="btn-primary">
              <Plus size={18} /> Novo produto
            </button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Preço</th>
                  <th className="px-6 py-4">Estoque</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {products.map((p) => (
                    <motion.tr
                      key={p.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="transition hover:bg-brand-50/40"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="rounded-xl bg-brand-50 p-2 text-brand-500">
                            <Package size={18} />
                          </span>
                          <span className="font-semibold text-slate-800">{p.nome}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {p.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-brand-600">
                        {formatCurrency(p.preco)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-medium ${
                            p.estoque <= 5 ? 'text-red-500' : 'text-slate-700'
                          }`}
                        >
                          {p.estoque} un.
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditing(p)
                              setFormOpen(true)
                            }}
                            className="rounded-lg bg-brand-50 p-2 text-brand-700 transition hover:bg-brand-100"
                            aria-label="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setToDelete(p)}
                            className="rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                            aria-label="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Editar produto' : 'Novo produto'}
      >
        <ProductForm
          initialData={editing}
          onSubmit={handleSave}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        message={`Deseja realmente excluir ${toDelete?.nome}?`}
      />
    </div>
  )
}
