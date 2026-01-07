import { useMemo, useCallback, useState, useEffect } from 'react';
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
import { useSolutionTemplates } from '@/features/solution-templates/hooks';
import { debounce } from '@/lib/util';

export default function SolutionTemplates() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    searchQuery,
    selectedCategory,
    currentPage,
    isLoading,
    categories: apiCategories,
    templates: paginatedTemplates,
    totalTemplates,
    totalPages,
    handleSearch,
    handleCategoryChange,
    handlePageChange,
    handleClearFilters,
  } = useSolutionTemplates({
    itemsPerPage: 10,
    initialCategory: 'smartCity',
  });

  // Local state for input value (for immediate UI update)
  const [inputValue, setInputValue] = useState(searchQuery);

  // Create debounced search handler (900ms delay)
  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      handleSearch(value);
    }, 300),
    []
  );

  // Handle input change with immediate UI update and debounced search
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Update input value immediately for responsive UI (doesn't trigger API)
    setInputValue(value);
    // Debounce the actual search API call
    debouncedSearch(value);
  }, [debouncedSearch]);

  // Sync input value when searchQuery changes externally (e.g., clear filters)
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Map API categories to component format with icons
  const iconMap: Record<string, typeof Building2> = {
    smartCity: Building2,
    smartAgriculture: Sprout,
    smartBuilding: Building,
    smartTransportation: Car,
    smartHome: Home,
    smartFactory: Factory,
    healthcare: Building2, // Fallback icon
    energy: Building2, // Fallback icon
    retail: Building2, // Fallback icon
  };
  const categories = apiCategories.map((cat) => ({
    key: cat.key,
    icon: iconMap[cat.key] || Building2,
    translationKey: cat.translationKey,
  }));

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
        <div className="flex flex-col md:flex-row justify-between items-center shadow-sm p-4 rounded-lg bg-[#D9D9D92B]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
            <Input
              placeholder={t('solutionTemplates.searchPlaceholder')}
              value={inputValue}
              onChange={handleInputChange}
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
              <div className="flex gap-4 flex-wrap  w-full">
                {categories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => handleCategoryChange(category.key)}
                    className={`  flex-shrink-0 p-4  rounded-xl transition-all flex flex-col items-center gap-3 ${
                      selectedCategory === category.key
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {/* <category.icon className="h-10 w-10" /> */}
                    <span className="text-sm font-medium">
                      {t(category.translationKey || `solutionTemplates.categories.${category.key}`)}
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
            {t('solutionTemplates.templatesCount', { count: totalTemplates })}
          </h2>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
            </div>
          )}

          {/* Template Cards Grid */}
          {!isLoading && (
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
          )}

          {/* Empty State */}
          {!isLoading && paginatedTemplates.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Building2 className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {t('solutionTemplates.noTemplatesFound')}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t('solutionTemplates.tryAdjustingSearch')}
                </p>
                <Button variant="ghost" onClick={handleClearFilters}>
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
