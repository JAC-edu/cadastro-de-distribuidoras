import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Edit, Trash2, Plus } from 'lucide-react';
import type { Distributor } from '../types';

interface DashboardProps {
  distributors: Distributor[];
}

export default function Dashboard({ distributors }: DashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Distribuidoras</h1>
          <p className="text-slate-600 mt-1">Gerencie todas as suas distribuidoras</p>
        </div>
        <Link
          to="/nova"
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Distribuidora
        </Link>
      </div>

      {distributors.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-12 text-center"
        >
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800">Nenhuma distribuidora cadastrada</h2>
          <p className="text-slate-600 mt-2">Comece cadastrando sua primeira distribuidora</p>
          <Link
            to="/nova"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors mt-6"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Distribuidora
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {distributors.map((distributor, index) => (
            <motion.div
              key={distributor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-lg">{distributor.name}</h3>
                  <p className="text-slate-600 text-sm mt-1">Localização: {distributor.location}</p>
                  <p className="text-slate-600 text-sm">{distributor.address}</p>
                  {distributor.observation && <p className="text-slate-600 text-sm">{distributor.observation}</p>}
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/distribuidor/${distributor.id}`}
                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    title="Deletar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
