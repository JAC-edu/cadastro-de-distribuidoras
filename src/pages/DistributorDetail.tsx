import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function DistributorDetail() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-slate-900">Detalhes da Distribuidora</h1>
        <p className="text-slate-600 mt-2">Página em desenvolvimento</p>
      </div>
    </motion.div>
  );
}
