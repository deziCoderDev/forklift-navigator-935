
import React from 'react';
import { Gauge, Shield, Clock, Users, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card dark:bg-card border-t border-border mt-auto">
      <div className="w-full px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Informações do Sistema */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-primary rounded-lg">
                <Gauge className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-foreground">FleetPro</h4>
                <p className="text-xs text-muted-foreground">v2.1.0</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Sistema de Gestão de Frotas
            </p>
          </div>

          {/* Status do Sistema */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Status do Sistema</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Todos os serviços operacionais</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Última atualização: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Informações Técnicas */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Suporte Técnico</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Shield className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Sistema seguro e confiável</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Suporte 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">
              © 2024 FleetPro. Sistema de Gestão de Frotas - Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>Desenvolvido por diversão</span>
              <a 
                href="https://github.com/olucasmf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

