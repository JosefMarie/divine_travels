"use client";

import React, { ErrorInfo, ReactNode } from "react";
import { ShieldAlert, RefreshCw, Terminal } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class SystemErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[SYSTEM_FAILURE] in ${this.props.componentName || 'Unknown Component'}:`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full min-h-[400px] flex items-center justify-center p-8 glass-panel border border-tertiary/20 relative overflow-hidden bg-tertiary/[0.02]">
          {/* HUD Background elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
             <div className="absolute inset-0 technical-grid" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center max-w-md">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="mb-6 text-tertiary"
            >
              <ShieldAlert size={48} strokeWidth={1} />
            </motion.div>
            
            <h3 className="font-technical text-[10px] text-tertiary uppercase font-bold tracking-[0.4em] mb-4">
              Module_Failure_Detected
            </h3>
            
            <h2 className="font-heading text-2xl text-primary mb-4 italic">
              Communication Link Severed
            </h2>
            
            <p className="font-body text-sm text-primary/60 mb-8 leading-relaxed">
              The {this.props.componentName || 'requested module'} has encountered a critical integrity error. 
              Attempting to re-establish satellite synchronization.
            </p>

            <div className="flex flex-col gap-4 w-full">
              <button 
                onClick={this.handleReset}
                className="w-full bg-tertiary text-neutral py-3 font-technical text-[9px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <RefreshCw size={12} />
                Re-initialize Module
              </button>
              
              <div className="p-3 bg-primary/[0.03] border border-primary/5 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal size={10} className="text-primary/40" />
                  <span className="font-technical text-[7px] text-primary/40 uppercase font-bold tracking-widest">Error_Log_Extract</span>
                </div>
                <code className="block font-technical text-[9px] text-tertiary/60 break-all leading-tight">
                  {this.state.error?.message || "UNDEFINED_FAILURE_PROTOCOL"}
                </code>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
