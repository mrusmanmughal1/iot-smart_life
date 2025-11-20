import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload } from 'lucide-react';

export default function CreateTemplatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null as File | null,
    visibility: 'public',
    defaultState: 'fullScreen',
    autoRefresh: 'every5Minutes',
    defaultTimeWindow: 'last24Hours',
  });

  // Map keys to translation keys for Select components
  const visibilityOptions = [
    { value: 'public', label: t('createTemplate.visibility.public') },
    { value: 'private', label: t('createTemplate.visibility.private') },
    { value: 'shared', label: t('createTemplate.visibility.shared') },
  ];

  const stateOptions = [
    { value: 'fullScreen', label: t('createTemplate.states.fullScreen') },
    { value: 'windowed', label: t('createTemplate.states.windowed') },
    { value: 'minimized', label: t('createTemplate.states.minimized') },
  ];

  const refreshIntervalOptions = [
    { value: 'disabled', label: t('createTemplate.refreshIntervals.disabled') },
    { value: 'every1Minute', label: t('createTemplate.refreshIntervals.every1Minute') },
    { value: 'every5Minutes', label: t('createTemplate.refreshIntervals.every5Minutes') },
    { value: 'every10Minutes', label: t('createTemplate.refreshIntervals.every10Minutes') },
    { value: 'every30Minutes', label: t('createTemplate.refreshIntervals.every30Minutes') },
    { value: 'every1Hour', label: t('createTemplate.refreshIntervals.every1Hour') },
  ];

  const timeWindowOptions = [
    { value: 'last1Hour', label: t('createTemplate.timeWindows.last1Hour') },
    { value: 'last6Hours', label: t('createTemplate.timeWindows.last6Hours') },
    { value: 'last24Hours', label: t('createTemplate.timeWindows.last24Hours') },
    { value: 'last7Days', label: t('createTemplate.timeWindows.last7Days') },
    { value: 'last30Days', label: t('createTemplate.timeWindows.last30Days') },
    { value: 'lastYear', label: t('createTemplate.timeWindows.lastYear') },
  ];

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Add API call to save template
    navigate('/solution-templates');
  };

  const handleCancel = () => {
    navigate('/solution-templates');
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900">
          {t('createTemplate.title')}
        </h1>

        {/* Form Card */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column - Template Details */}
                <div className="space-y-6">
                  {/* Template Title */}
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {t('createTemplate.templateTitle')}
                    </label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder={t('createTemplate.templateTitlePlaceholder')}
                      className="w-full"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {t('createTemplate.description')}
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder={t('createTemplate.descriptionPlaceholder')}
                      className="min-h-[120px] w-full"
                    />
                  </div>

                  {/* Template Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('createTemplate.templateImage')}
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        {imagePreview ? (
                          <div className="w-full h-full rounded-lg overflow-hidden">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">
                                {t('createTemplate.dropImageOrClick')}
                              </span>
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right Column - Settings */}
                <div className="space-y-6">
                  {/* Settings (Visibility) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('createTemplate.settingsVisibility')}
                    </label>
                    <Select
                      value={formData.visibility}
                      onValueChange={(value) =>
                        handleSelectChange('visibility', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('createTemplate.selectVisibility')} />
                      </SelectTrigger>
                      <SelectContent>
                        {visibilityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Default State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('createTemplate.defaultState')}
                    </label>
                    <Select
                      value={formData.defaultState}
                      onValueChange={(value) =>
                        handleSelectChange('defaultState', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('createTemplate.selectDefaultState')} />
                      </SelectTrigger>
                      <SelectContent>
                        {stateOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Auto Refresh */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('createTemplate.autoRefresh')}
                    </label>
                    <Select
                      value={formData.autoRefresh}
                      onValueChange={(value) =>
                        handleSelectChange('autoRefresh', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('createTemplate.selectRefreshInterval')} />
                      </SelectTrigger>
                      <SelectContent>
                        {refreshIntervalOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Default Time Window */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('createTemplate.defaultTimeWindow')}
                    </label>
                    <Select
                      value={formData.defaultTimeWindow}
                      onValueChange={(value) =>
                        handleSelectChange('defaultTimeWindow', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('createTemplate.selectTimeWindow')} />
                      </SelectTrigger>
                      <SelectContent>
                        {timeWindowOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex  gap-4 mt-8 pt-6  ">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancel}
                  className="px-6"
                >
                  {t('createTemplate.cancel')}
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white px-6"
                >
                  {t('createTemplate.save')}
                </Button>
              </div>
                </div>
              </div>

               
              
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

