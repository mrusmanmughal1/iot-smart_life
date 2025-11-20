import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Sprout,
  Building,
  Car,
  Home,
  Factory,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Plus,
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  images: string[];
  isActivated?: boolean;
}

const templates: Template[] = [
  {
    id: '1',
    name: 'Smart City',
    description: 'Comprehensive urban monitoring and management.',
    category: 'Smart City',
    tags: ['Energy', 'Traffic', 'Waste'],
    images: ['/placeholder-city-1.png', '/placeholder-city-2.png'],
    isActivated: true,
  },
  {
    id: '2',
    name: 'Smart Agriculture',
    description: 'Optimize farming operations with soil monitoring.',
    category: 'Smart Agriculture',
    tags: ['Farming', 'Water', 'Crops'],
    images: [
      '/placeholder-agriculture-1.png',
      '/placeholder-agriculture-2.png',
    ],
    isActivated: true,
  },
  {
    id: '3',
    name: 'Smart Building',
    description:
      'Complete building management system with HVAC control, occupancy monitoring.',
    category: 'Smart Building',
    tags: ['HVAC', 'Security', 'Occupancy'],
    images: ['/placeholder-building-1.png', '/placeholder-building-2.png'],
    isActivated: true,
  },
  {
    id: '4',
    name: 'Smart Transportation',
    description: 'Traffic management and vehicle tracking system.',
    category: 'Smart Transportation',
    tags: ['Traffic', 'Vehicles', 'Logistics'],
    images: ['/placeholder-transport-1.png', '/placeholder-transport-2.png'],
    isActivated: false,
  },
  {
    id: '5',
    name: 'Smart Home',
    description: 'Home automation and energy management.',
    category: 'Smart Home',
    tags: ['Automation', 'Energy', 'Security'],
    images: ['/placeholder-home-1.png', '/placeholder-home-2.png'],
    isActivated: false,
  },
  {
    id: '6',
    name: 'Smart Factory',
    description: 'Industrial IoT solution for manufacturing.',
    category: 'Smart Factory',
    tags: ['Manufacturing', 'Industry 4.0', 'Automation'],
    images: ['/placeholder-factory-1.png', '/placeholder-factory-2.png'],
    isActivated: false,
  },
  {
    id: '7',
    name: 'Smart City Advanced',
    description: 'Advanced urban monitoring with AI integration.',
    category: 'Smart City',
    tags: ['AI', 'Analytics', 'Urban'],
    images: ['/placeholder-city-3.png', '/placeholder-city-4.png'],
    isActivated: false,
  },
  {
    id: '8',
    name: 'Smart Agriculture Pro',
    description: 'Precision farming with drone integration.',
    category: 'Smart Agriculture',
    tags: ['Drones', 'Precision', 'IoT'],
    images: [
      '/placeholder-agriculture-3.png',
      '/placeholder-agriculture-4.png',
    ],
    isActivated: false,
  },
  {
    id: '9',
    name: 'Smart Building Enterprise',
    description: 'Enterprise-grade building management solution.',
    category: 'Smart Building',
    tags: ['Enterprise', 'BMS', 'Commercial'],
    images: ['/placeholder-building-3.png', '/placeholder-building-4.png'],
    isActivated: false,
  },
  {
    id: '10',
    name: 'Smart Transportation Hub',
    description: 'Multi-modal transportation management.',
    category: 'Smart Transportation',
    tags: ['Multimodal', 'Hub', 'Management'],
    images: ['/placeholder-transport-3.png', '/placeholder-transport-4.png'],
    isActivated: false,
  },
  {
    id: '11',
    name: 'Smart Home Premium',
    description: 'Premium home automation with voice control.',
    category: 'Smart Home',
    tags: ['Voice', 'Premium', 'Smart'],
    images: ['/placeholder-home-3.png', '/placeholder-home-4.png'],
    isActivated: false,
  },
  {
    id: '12',
    name: 'Smart Factory 4.0',
    description: 'Industry 4.0 compliant manufacturing solution.',
    category: 'Smart Factory',
    tags: ['Industry 4.0', 'Compliance', 'Advanced'],
    images: ['/placeholder-factory-3.png', '/placeholder-factory-4.png'],
    isActivated: false,
  },
  {
    id: '13',
    name: 'Smart City Infrastructure',
    description: 'Infrastructure monitoring and maintenance.',
    category: 'Smart City',
    tags: ['Infrastructure', 'Monitoring', 'Maintenance'],
    images: ['/placeholder-city-5.png', '/placeholder-city-6.png'],
    isActivated: false,
  },
  {
    id: '14',
    name: 'Smart Agriculture Monitoring',
    description: 'Real-time crop and soil monitoring system.',
    category: 'Smart Agriculture',
    tags: ['Monitoring', 'Real-time', 'Soil'],
    images: [
      '/placeholder-agriculture-5.png',
      '/placeholder-agriculture-6.png',
    ],
    isActivated: false,
  },
];

export default function SolutionTemplates() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('smartCity');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const categories = [
    { key: 'smartCity', icon: Building2 },
    { key: 'smartAgriculture', icon: Sprout },
    { key: 'smartBuilding', icon: Building },
    { key: 'smartTransportation', icon: Car },
    { key: 'smartHome', icon: Home },
    { key: 'smartFactory', icon: Factory },
  ];

  // Map category keys to template category names for filtering
  const categoryKeyToName: Record<string, string> = {
    smartCity: 'Smart City',
    smartAgriculture: 'Smart Agriculture',
    smartBuilding: 'Smart Building',
    smartTransportation: 'Smart Transportation',
    smartHome: 'Smart Home',
    smartFactory: 'Smart Factory',
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === 'all' || template.category === categoryKeyToName[selectedCategory];
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTemplates = filteredTemplates.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          {t('solutionTemplates.title')}
        </h1>
      </div>

      <div className="border border-secondary p-4 rounded-2xl">
        {/* Search Bar */}
        <div className="flex justify-between items-center shadow-sm p-4 rounded-lg bg-[#D9D9D92B]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder={t('solutionTemplates.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-96 rounded-md"
            />
          </div>
          <Button
            className="bg-secondary hover:bg-secondary/90 text-white"
            onClick={() => navigate('/solution-templates/create')}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('solutionTemplates.createNewTemplate')}
          </Button>
        </div>

        {/* Popular Domain Section */}
        <div className="  rounded-lg p-4  ">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">
            {t('solutionTemplates.popularDomain')}
          </h2>
          <div className="relative">
            <div className="flex items-center gap-4  ">
              <div className="flex gap-4   w-full">
                {categories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => {
                      setSelectedCategory(category.key);
                      setCurrentPage(1);
                    }}
                    className={`  flex-shrink-0 p-4  rounded-xl transition-all flex flex-col items-center gap-3 ${
                      selectedCategory === category.key
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {/* <category.icon className="h-10 w-10" /> */}
                    <span className="text-sm font-medium">
                      {t(`solutionTemplates.categories.${category.key}`)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Templates Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('solutionTemplates.templatesCount', { count: filteredTemplates.length })}
          </h2>

          {/* Template Cards Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {paginatedTemplates.map((template) => (
              <Card
                key={template.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  {/* Thumbnail Images */}
                  <div className="flex gap-2 mb-4">
                    {template.images.map((image, index) => (
                      <div
                        key={index}
                        className="flex-1 h-20 bg-gray-200 rounded-lg overflow-hidden relative"
                        style={{
                          background:
                            index === 0
                              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        }}
                      >
                        <img
                          src={image}
                          alt={`${template.name} preview ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <CardTitle className="text-lg font-bold text-gray-900 mb-2">
                    {template.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {template.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-blue-100 text-blue-700 border-0 text-xs rounded-md px-2 py-1"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90 text-white"
                      onClick={() => navigate(`/solution-templates/preview/${template.id}`)}
                    >
                      {t('solutionTemplates.preview')}
                    </Button>
                    <Button
                      className={`flex-1 ${
                        template.isActivated
                          ? 'bg-secondary hover:bg-secondary/90 text-white'
                          : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                      }`}
                    >
                      {template.isActivated
                        ? t('solutionTemplates.activated')
                        : t('solutionTemplates.activate')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {paginatedTemplates.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Building2 className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {t('solutionTemplates.noTemplatesFound')}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t('solutionTemplates.tryAdjustingSearch')}
                </p>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  {t('solutionTemplates.clearFilters')}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="h-8 w-8"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="h-8 w-8"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
