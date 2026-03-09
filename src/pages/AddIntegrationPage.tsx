import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Search,
  Filter,
  Radio,
  Plug,
  Webhook,
  Cloud,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { useCreateIntegration } from '@/features/integrations/Hooks';

const INTEGRATION_TYPES = [
  {
    id: 'mqtt',
    name: 'MQTT',
    icon: <Radio className="h-6 w-6" />,
    description: 'Message Queue Telemetry Transport Protocol',
    details: 'Select this to configure MQTT broker connections.',
  },
  {
    id: 'http',
    name: 'HTTP',
    icon: <Plug className="h-6 w-6" />,
    description: 'Hypertext Transfer Protocol',
    details: 'Select this for generic REST API integrations.',
  },
  {
    id: 'aws_iot',
    name: 'AWS IoT',
    icon: <Cloud className="h-6 w-6" />,
    description: 'Amazon Web Services IoT Core',
    details: 'Select this for AWS IoT Core integration.',
  },
];

export default function AddIntegrationPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('mqtt');
  const [useCredentials, setUseCredentials] = useState(true);
  const createMutation = useCreateIntegration();

  const [formData, setFormData] = useState({
    name: '',
    host: 'localhost',
    port: '1883',
    topicFilter: 'Sensor/+/Telemetry',
    username: 'localhost',
    password: '********',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    if (!formData.name) {
      toast.error('Integration name is required');
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: formData.name,
        type: selectedType as any,
        enabled: true,
        config: {
          host: formData.host,
          port: formData.port,
          topicFilter: formData.topicFilter,
          username: formData.username,
          password: formData.password,
        },
      });
      toast.success('Integration created successfully');
      navigate('/integrations');
    } catch (error) {
      toast.error('Failed to create integration');
    }
  };

  return (
    <div className="space-y-8   max-w-[1200px] mx-auto min-h-screen pb-20">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Add Integration
          </h1>
          <p className="text-gray-500 text-sm">
            Configure A New Data Integration
          </p>
          <Button
            className="mt-4 bg-primary  text-white hover:bg-primary/80 px-6"
            onClick={() => navigate('/integrations')}
          >
            + Add Integration
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search Integrations..."
              className="pl-9 bg-white border-gray-200 focus:ring-1 focus:ring-indigo-500 rounded-lg"
            />
          </div>
          <Button
            variant="secondary"
            className="bg-primary  text-white hover:bg-primary/80 px-6"
          >
            Filter
          </Button>
        </div>
      </div>

      {/* Selector Section */}
      <div className="space-y-4">
        <div className="bg-[#eff6ff] rounded-2xl p-6 border-none">
          <h2 className="text-lg font-semibold text-gray-800">
            Select Integration Type
          </h2>
          <p className="text-gray-500 text-sm">
            Choose the type of integration you want to configure
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {INTEGRATION_TYPES.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all duration-200 border-2 ${
                  isSelected
                    ? 'border-indigo-100 ring-2 ring-indigo-50 shadow-md'
                    : 'border-gray-100 hover:border-gray-200 shadow-sm'
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className={`${isSelected ? 'text-indigo-600' : 'text-gray-400'}`}
                    >
                      {type.icon}
                    </div>
                    <span className="font-bold text-gray-800">{type.name}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                    {type.description}
                  </p>
                  {isSelected && (
                    <div className="flex items-center gap-1.5 text-[#22c55e] text-xs font-bold">
                      <CheckCircle2 className="h-4 w-4" />
                      Selected
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Configuration Section */}
      <Card className="border border-gray-100 shadow-sm rounded-xl overflow-hidden mt-12 bg-white">
        <CardHeader className="pt-8 px-10 pb-0">
          <CardTitle className="text-xl font-bold text-gray-800 uppercase tracking-wide">
            {selectedType.toUpperCase()} Integration Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10">
          <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
            <div className="space-y-8">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-500">
                  Integration Name *
                </Label>
                <Input
                  placeholder="My MQTT Integration"
                  className="bg-[#fafafa] border-gray-100 focus:bg-white transition-colors"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-500">
                  MQTT Broker Host *
                </Label>
                <Input
                  placeholder="Localhost"
                  className="bg-[#fafafa] border-gray-100 focus:bg-white transition-colors"
                  value={formData.host}
                  onChange={(e) => handleInputChange('host', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-500">
                    Port *
                  </Label>
                  <Input
                    placeholder="1883"
                    className="bg-[#fafafa] border-gray-100 focus:bg-white transition-colors"
                    value={formData.port}
                    onChange={(e) => handleInputChange('port', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-500">
                    Topic Filter *
                  </Label>
                  <Input
                    placeholder="Sensor/+/Telemetry"
                    className="bg-[#fafafa] border-gray-100 focus:bg-white transition-colors"
                    value={formData.topicFilter}
                    onChange={(e) =>
                      handleInputChange('topicFilter', e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center space-x-2 pb-2">
                <input
                  type="checkbox"
                  id="credentials"
                  checked={useCredentials}
                  onChange={(e) => setUseCredentials(e.target.checked)}
                  className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="credentials"
                  className="text-sm font-semibold text-gray-400 leading-none"
                >
                  Authentication
                  <span className="block text-[10px] uppercase mt-0.5">
                    Use Credentials
                  </span>
                </label>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-500">
                  Username
                </Label>
                <Input
                  placeholder="Localhost"
                  className="bg-[#fafafa] border-gray-100 focus:bg-white transition-colors"
                  disabled={!useCredentials}
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange('username', e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-500">
                  Password
                </Label>
                <Input
                  type="password"
                  placeholder="********"
                  className="bg-[#fafafa] border-gray-100 focus:bg-white transition-colors"
                  disabled={!useCredentials}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions Section */}
      <div className="flex justify-end items-center gap-4 pt-6">
        <Button
          className="bg-[#4338ca] hover:bg-[#3730a3] text-white px-10 font-bold rounded-lg h-12"
          onClick={handleCreate}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? 'Creating...' : 'Create'}
        </Button>
        <Button className="bg-[#a21caf] hover:bg-[#86198f] text-white px-10 font-bold rounded-lg h-12">
          Test
        </Button>
        <Button
          variant="secondary"
          className="bg-[#333333] hover:bg-[#222222] text-white px-10 font-bold rounded-lg h-12"
          onClick={() => navigate('/integrations')}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
