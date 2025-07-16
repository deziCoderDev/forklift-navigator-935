
import React from 'react';
import { cn } from '@/lib/utils';
import { Operador, StatusCertificacao, FuncaoOperador } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Calendar, Phone, Trash2, User as UserIcon } from 'lucide-react';

interface OperatorCardProps {
  operator: Operador;
  onViewDetails: (operator: Operador) => void;
  onEdit: (operator: Operador) => void;
  onDelete: () => void;
}

const OperatorCard: React.FC<OperatorCardProps> = ({ operator, onViewDetails, onEdit, onDelete }) => {
  // Get status color classes
  const getStatusBadge = (status: StatusCertificacao) => {
    switch (status) {
      case StatusCertificacao.VALIDO:
        return (
          <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 font-semibold tracking-wide shadow-lg shadow-emerald-500/25 text-xs px-3 py-1.5 whitespace-nowrap shrink-0 rounded-full">
            ✓ Válido
          </Badge>
        );
      case StatusCertificacao.VENCENDO:
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 font-semibold tracking-wide shadow-lg shadow-amber-500/25 animate-pulse text-xs px-3 py-1.5 whitespace-nowrap shrink-0 rounded-full">
            ⚠ Vencendo
          </Badge>
        );
      case StatusCertificacao.VENCIDO:
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 font-semibold tracking-wide shadow-lg shadow-red-500/25 text-xs px-3 py-1.5 whitespace-nowrap shrink-0 rounded-full">
            ✗ Vencido
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gradient-to-r from-slate-500 to-slate-600 text-white border-0 font-semibold tracking-wide text-xs px-3 py-1.5 whitespace-nowrap shrink-0 rounded-full">
            {status}
          </Badge>
        );
    }
  };

  // Get role color for badge
  const getRoleBadge = (role: FuncaoOperador) => {
    const colors = {
      [FuncaoOperador.OPERADOR]: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      [FuncaoOperador.SUPERVISOR]: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      [FuncaoOperador.TECNICO]: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      [FuncaoOperador.COORDENADOR]: 'bg-orange-500/20 text-orange-300 border-orange-400/30',
      [FuncaoOperador.GERENTE]: 'bg-red-500/20 text-red-300 border-red-400/30'
    };
    
    return colors[role] || 'bg-slate-500/20 text-slate-300 border-slate-400/30';
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  // Get the first ASO and NR-11 certificates for display
  const asoCert = operator.certificacoes.find(cert => cert.tipo === 'ASO');
  const nrCert = operator.certificacoes.find(cert => cert.tipo === 'NR-11');

  return (
    <div 
      className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 cursor-pointer transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-slate-900/40 hover:scale-102 hover:-translate-y-1 hover:border-slate-600/60 animate-fade-in"
      onClick={() => onViewDetails(operator)}
      style={{
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
    >
      {/* Delete button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        className="absolute top-2 right-2 h-6 w-6 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/20 transition-all duration-200 z-20 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-full opacity-80 hover:opacity-100"
        title="Excluir operador"
      >
        <Trash2 className="h-3 w-3" />
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-2 mb-3">
        <div className="flex items-start justify-between pr-8">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white mb-0.5 tracking-wide truncate">
              {operator.id}
            </h3>
            <p className="text-slate-400 font-medium tracking-wide text-sm truncate mb-[5px]" style={{ color: '#94a3b8' }}>
              {operator.nome}
            </p>
          </div>
        </div>
      </div>

      {/* Role and Contact Section */}
      <div className="relative bg-gradient-to-br from-slate-800/40 to-slate-900/80 rounded-2xl p-6 mb-3 border border-slate-700/30">
        {/* Role Badge - Top Left Corner */}
        <div className="absolute -top-3 left-2 z-10">
          <Badge variant="outline" className={cn("border font-semibold text-xs tracking-wider whitespace-nowrap shrink-0 px-3 py-1 rounded-full", getRoleBadge(operator.funcao))}>
            {operator.funcao}
          </Badge>
        </div>

        {/* Contact Content - Centered */}
        <div className="text-center pt-4">
          <div className="text-slate-400 text-xs font-bold tracking-[2px] uppercase mb-3" style={{ color: '#6b7280' }}>
            CONTATO
          </div>
          <div className="flex items-center justify-center text-lg font-semibold text-blue-400">
            <Phone className="w-4 h-4 mr-2" />
            {operator.telefone}
          </div>
        </div>
      </div>

      {/* Certifications Section */}
      <div className="space-y-3 mb-3">
        <div className="flex items-center gap-2">
          <BadgeCheck className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold tracking-[2px] uppercase text-slate-400">Certificações</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border border-slate-700/30 bg-slate-800/30">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-slate-300">ASO</span>
              {getStatusBadge(asoCert?.status || StatusCertificacao.VALIDO)}
            </div>
            <div className="text-xs text-slate-400">
              {asoCert?.dataVencimento || 'N/A'}
            </div>
          </div>
          
          <div className="p-3 rounded-lg border border-slate-700/30 bg-slate-800/30">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-slate-300">NR-11</span>
              {getStatusBadge(nrCert?.status || StatusCertificacao.VALIDO)}
            </div>
            <div className="text-xs text-slate-400">
              {nrCert?.dataVencimento || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 min-w-0 flex-1" style={{ color: '#64748b' }}>
            <UserIcon className="w-3 h-3 flex-shrink-0" />
            <span className="font-medium tracking-wide truncate">Turno</span>
          </div>
          <span className="font-semibold text-slate-200 text-xs flex-shrink-0" style={{ color: '#e2e8f0' }}>
            {operator.turno}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 min-w-0 flex-1" style={{ color: '#64748b' }}>
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span className="font-medium tracking-wide truncate">Admissão</span>
          </div>
          <span className="font-semibold text-slate-200 text-xs flex-shrink-0" style={{ color: '#e2e8f0' }}>
            {operator.dataAdmissao}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OperatorCard;
