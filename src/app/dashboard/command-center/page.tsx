'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, CheckCircle2, XCircle, Loader2, FileCheck, Type, ShieldAlert, FileCode } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { runCommandCenterAction } from '@/lib/actions';

type Status = 'idle' | 'running' | 'success' | 'error';
type Output = {
  status: Status;
  log: string;
};
type ActionType = 'test' | 'typecheck' | 'lint' | 'audit';

const StatusIndicator = ({ status }: { status: Status }) => {
  switch (status) {
    case 'running':
      return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    case 'success':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-destructive" />;
    default:
      return <div className="h-5 w-5 rounded-full bg-gray-400" />;
  }
};

const ActionCard = ({ title, description, icon: Icon, onRun, output }: { title: string; description: string; icon: React.ElementType; onRun: () => void; output: Output }) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <Icon className="h-6 w-6 text-primary" />
                             <CardTitle>{title}</CardTitle>
                        </div>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                        <StatusIndicator status={output.status} />
                        <Button onClick={onRun} disabled={output.status === 'running'} size="sm">
                            <Play className="mr-2 h-4 w-4" />
                            {output.status === 'running' ? 'Running...' : 'Run'}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            {output.log && (
                <CardContent>
                    <Alert variant={output.status === 'error' ? 'destructive' : 'default'}>
                        <AlertTitle>{output.status === 'error' ? 'Error Log' : 'Output Log'}</AlertTitle>
                        <AlertDescription>
                            <pre className="mt-2 rounded-md bg-muted p-4 text-xs whitespace-pre-wrap font-mono">
                                {output.log}
                            </pre>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            )}
        </Card>
    )
}

export default function CommandCenterPage() {
  const [outputs, setOutputs] = useState<Record<ActionType, Output>>({
    test: { status: 'idle', log: '' },
    typecheck: { status: 'idle', log: '' },
    lint: { status: 'idle', log: '' },
    audit: { status: 'idle', log: '' },
  });

  const handleRunAction = async (action: ActionType) => {
    setOutputs(prev => ({ ...prev, [action]: { status: 'running', log: `Executing npm run ${action}...` } }));
    try {
      const { stdout, stderr } = await runCommandCenterAction(action);
      const hasError = stderr && !stdout.includes('npm ERR!');

      setOutputs(prev => ({
        ...prev,
        [action]: {
          status: hasError ? 'error' : 'success',
          log: hasError ? stderr : stdout,
        },
      }));

    } catch (error: any) {
      setOutputs(prev => ({
        ...prev,
        [action]: {
          status: 'error',
          log: error.stderr || error.message || 'An unknown error occurred.',
        },
      }));
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Centro de Mando</h1>
        <p className="text-muted-foreground">
          Supervisión y gestión centralizada del ciclo de vida del proyecto.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Módulo de Calidad y Pruebas (QA Core)</CardTitle>
                <CardDescription>Ejecución de pruebas unitarias, de integración y análisis de tipos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ActionCard 
                    title="Unit & Integration Tests"
                    description="Ejecuta el conjunto de pruebas con `npm test` para validar la integridad del código."
                    icon={FileCheck}
                    onRun={() => handleRunAction('test')}
                    output={outputs.test}
                />
                 <ActionCard 
                    title="Type Checking"
                    description="Ejecuta `npm typecheck` para verificar la consistencia de tipos en el proyecto."
                    icon={Type}
                    onRun={() => handleRunAction('typecheck')}
                    output={outputs.typecheck}
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Salud del Código y Mantenimiento (Code Guardian)</CardTitle>
                <CardDescription>Ejecución de análisis estático para mantener la calidad y consistencia del código.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ActionCard 
                    title="Linting"
                    description="Ejecuta `npm run lint` para encontrar y corregir problemas en el código."
                    icon={FileCode}
                    onRun={() => handleRunAction('lint')}
                    output={outputs.lint}
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Seguridad (Security Sentinel)</CardTitle>
                <CardDescription>Análisis de dependencias para detectar y corregir vulnerabilidades.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ActionCard 
                    title="Dependency Audit"
                    description="Ejecuta `npm audit` para escanear en busca de vulnerabilidades conocidas."
                    icon={ShieldAlert}
                    onRun={() => handleRunAction('audit')}
                    output={outputs.audit}
                />
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
