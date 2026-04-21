import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Terminal, KeyRound, Info } from 'lucide-react';

interface DeviceCredentialsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credentials: any | null;
}

export const DeviceCredentialsDialog: React.FC<
  DeviceCredentialsDialogProps
> = ({ open, onOpenChange, credentials }) => {
  const { t } = useTranslation();
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  if (!credentials) return null;

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [key]: true });
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const renderCopyButton = (text: string, key: string) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 shrink-0"
      onClick={() => handleCopy(text, key)}
    >
      {copiedStates[key] ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4 text-slate-400" />
      )}
    </Button>
  );

  const renderCredentialRow = (
    label: string,
    value: string,
    copyKey: string
  ) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800">
      <div className="flex flex-col overflow-hidden w-full mr-2">
        <span className="text-xs text-slate-500 dark:text-gray-400 font-medium mb-1">
          {label}
        </span>
        <span className="text-sm font-mono truncate">{value}</span>
      </div>
      {renderCopyButton(value, copyKey)}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-hidden rounded-lg border-none shadow-none dark:bg-gray-950 dark:border-gray-700">
        <DialogHeader className="dark:text-white dark:bg-gray-950 dark:border-gray-700 dark:border-b">
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-indigo-500" />
            {t('devices.credentials.title')}
          </DialogTitle>
          <DialogDescription>
            {t('devices.credentials.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="p-4">
          <Tabs defaultValue="credentials" className="w-full">
            <TabsList className="w-full grid-cols-3 grid mb-4">
              <TabsTrigger
                value="credentials"
                className="flex items-center justify-center gap-2"
              >
                <KeyRound className="h-4 w-4" /> {t('devices.credentials.tabs.credentials')}
              </TabsTrigger>
              <TabsTrigger
                value="setup"
                className="flex items-center justify-center gap-2"
              >
                <Info className="h-4 w-4" /> {t('devices.credentials.tabs.setup')}
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="flex items-center justify-center gap-2"
              >
                <Terminal className="h-4 w-4" /> {t('devices.credentials.tabs.examples')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="credentials" className="space-y-3">
              {renderCredentialRow(
                t('devices.credentials.fields.deviceKey'),
                credentials.deviceKey,
                'deviceKey'
              )}
              {renderCredentialRow(
                t('devices.credentials.fields.accessToken'),
                credentials.accessToken,
                'accessToken'
              )}
              {renderCredentialRow(
                t('devices.credentials.fields.mqttBroker'),
                credentials.mqttBroker,
                'mqttBroker'
              )}
              {renderCredentialRow(
                t('devices.credentials.fields.telemetryTopic'),
                credentials.telemetryTopic,
                'telemetryTopic'
              )}
            </TabsContent>

            <TabsContent value="setup" className="space-y-4">
              {credentials.gatewayConfig && (
                <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                  <h4 className="text-sm font-semibold mb-3 text-indigo-900 dark:text-indigo-300">
                    {t('devices.credentials.fields.gatewayConfig')}
                  </h4>
                  <div className="space-y-2 text-sm text-indigo-800 dark:text-indigo-200">
                    <div className="flex justify-between items-center group">
                      <span className="opacity-70">{t('devices.credentials.fields.clientId')}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">
                          {credentials.gatewayConfig.clientId}
                        </span>
                        {renderCopyButton(
                          credentials.gatewayConfig.clientId,
                          'g-client-id'
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center group">
                      <span className="opacity-70">{t('devices.credentials.fields.username')}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono truncate max-w-[200px]">
                          {credentials.gatewayConfig.username}
                        </span>
                        {renderCopyButton(
                          credentials.gatewayConfig.username,
                          'g-username'
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">{t('devices.credentials.fields.host')}</span>
                      <span className="font-mono">
                        {credentials.gatewayConfig.host}:
                        {credentials.gatewayConfig.port}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {credentials.setupInstructions?.steps && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">{t('devices.credentials.fields.instructions')}</h4>
                  <ul className="text-sm space-y-1.5 text-slate-600 dark:text-gray-300">
                    {credentials.setupInstructions.steps.map(
                      (step: string, i: number) => (
                        <li key={i}>{step}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </TabsContent>

            <TabsContent value="code">
              {credentials.codeExamples && (
                <Tabs
                  defaultValue={Object.keys(credentials.codeExamples)[0] || ''}
                  className="w-full"
                >
                  <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 mb-4 h-auto overflow-x-auto">
                    {Object.keys(credentials.codeExamples).map((lang) => (
                      <TabsTrigger
                        key={lang}
                        value={lang}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent capitalize pb-2 pt-1"
                      >
                        {lang}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {Object.entries(credentials.codeExamples).map(
                    ([lang, code]) => (
                      <TabsContent key={lang} value={lang}>
                        <div className="relative group">
                          <pre className="p-4 rounded-lg bg-slate-950 text-slate-50 overflow-x-auto text-xs font-mono">
                            <code>{code as string}</code>
                          </pre>
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="h-8 bg-white/10 hover:bg-white/20 text-white border-0"
                              onClick={() =>
                                handleCopy(code as string, `code-${lang}`)
                              }
                            >
                              {copiedStates[`code-${lang}`] ? (
                                <Check className="h-4 w-4 mr-1 text-green-400" />
                              ) : (
                                <Copy className="h-4 w-4 mr-1" />
                              )}
                              {copiedStates[`code-${lang}`] ? t('devices.credentials.actions.copied') : t('devices.credentials.actions.copy')}
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    )
                  )}
                </Tabs>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="p-4 border-t border-slate-200 dark:border-gray-800">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            {t('devices.credentials.actions.done')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
