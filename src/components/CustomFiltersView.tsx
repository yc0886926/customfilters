import React, { useState } from 'react';
import { ChevronLeft, Plus, MoreVertical, Info, CreditCard as Edit, Trash2, Users, FileText, ChevronDown } from 'lucide-react';
import { CreateCustomFilterPanel } from './CreateCustomFilterPanel';

interface CustomFiltersViewProps {
  onBack: () => void;
}

interface Filter {
  id: string;
  name: string;
  targetGroups: string[];
  enabled: boolean;
  filterType?: 'people' | 'applicants';
  selectedDocuments?: string[];
  selectedWorkflows?: string[];
}

export const CustomFiltersView: React.FC<CustomFiltersViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'people' | 'applicants' | 'templates'>('people');
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const mockFilters: Record<string, Filter[]> = {
    people: [
      {
        id: '1',
        name: 'Active Full-Time Employees in Engineering Department',
        targetGroups: ['HR', 'Managers', 'IT', 'Legal'],
        enabled: true
      },
      {
        id: '2',
        name: 'Remote Workers in North America Region',
        targetGroups: ['All Users', 'IT', 'Engineering Team', 'HR', 'Managers', 'Legal', 'Finance'],
        enabled: true
      },
      {
        id: '3',
        name: 'New Hires within Last 90 Days',
        targetGroups: ['HR', 'IT', 'Managers', 'Legal', 'Finance'],
        enabled: false
      },
      // Add more items to test pagination
      ...Array.from({ length: 15 }, (_, i) => ({
        id: `people-${i + 4}`,
        name: `People Filter ${i + 4} - ${['Department Specific', 'Location Based', 'Role Based', 'Seniority Level', 'Contract Type'][i % 5]}`,
        targetGroups: [
          'HR', 'Managers', 'IT', 'Legal', 'Finance', 'Engineering Team', 'Marketing', 'Sales', 'Operations'
        ].slice(0, Math.floor(Math.random() * 6) + 2),
        enabled: i % 3 !== 0
      }))
    ],
    applicants: [
      {
        id: '4',
        name: 'Senior Level Candidates for Technical Roles',
        targetGroups: ['Recruiters', 'Hiring Managers', 'Engineering Team'],
        enabled: true
      },
      {
        id: '5',
        name: 'Technical Interviews Pending Review',
        targetGroups: ['Engineering Team', 'HR', 'Recruiters', 'Hiring Managers', 'IT'],
        enabled: true
      },
      // Add more items to test pagination
      ...Array.from({ length: 12 }, (_, i) => ({
        id: `applicants-${i + 6}`,
        name: `Applicant Filter ${i + 6} - ${['Skills Based', 'Experience Level', 'Location Preference', 'Salary Range', 'Availability'][i % 5]}`,
        targetGroups: [
          'Recruiters', 'Hiring Managers', 'HR', 'Engineering Team', 'Marketing', 'Sales'
        ].slice(0, Math.floor(Math.random() * 4) + 2),
        enabled: i % 4 !== 0
      }))
    ],
    templates: [
      {
        id: '6',
        name: 'Employment Contract Templates for Full-Time Staff',
        targetGroups: ['Legal', 'HR'],
        enabled: true,
        filterType: 'people',
        selectedDocuments: ['Certificate of Employment', 'Offer Letter Template', 'Employee Handbook'],
        selectedWorkflows: ['Onboarding Workflow', 'Performance Review Process']
      },
      {
        id: '7',
        name: 'Applicant Document Processing and Verification',
        targetGroups: ['Recruiters', 'Hiring Managers', 'HR', 'Legal'],
        enabled: false,
        filterType: 'applicants',
        selectedDocuments: ['Reference Check Form', 'Work Authorization'],
        selectedWorkflows: ['Background Check Process', 'Reference Verification', 'Training Enrollment']
      },
      // Add more items to test pagination
      ...Array.from({ length: 16 }, (_, i) => ({
        id: `templates-${i + 8}`,
        name: `Template Filter ${i + 8} - ${['Onboarding Documents', 'Performance Reviews', 'Exit Procedures', 'Training Materials', 'Compliance Forms'][i % 5]}`,
        targetGroups: ['HR', 'Legal', 'Managers', 'IT'].slice(0, Math.floor(Math.random() * 3) + 1),
        enabled: i % 3 !== 0,
        filterType: i % 2 === 0 ? 'people' : 'applicants',
        selectedDocuments: ['Document A', 'Document B', 'Document C'].slice(0, Math.floor(Math.random() * 3) + 1),
        selectedWorkflows: ['Workflow 1', 'Workflow 2'].slice(0, Math.floor(Math.random() * 2) + 1)
      }))
    ]
  };

  const currentFilters = mockFilters[activeTab] || [];
  
  // Pagination logic
  const totalItems = currentFilters.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = currentFilters.slice(startIndex, endIndex);
  
  // Reset to page 1 when changing tabs
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const tabs = [
    { id: 'people', label: 'People' },
    { id: 'applicants', label: 'Applicants' },
    { id: 'templates', label: 'Templates' }
  ];

  const handleDropdownToggle = (filterId: string) => {
    setActiveDropdown(activeDropdown === filterId ? null : filterId);
  };

  const handleCreateFilter = () => {
    setShowCreatePanel(true);
  };

  const toggleFilterStatus = (filterId: string) => {
    // In a real app, this would update the filter status
    console.log('Toggle filter status for:', filterId);
  };

  const renderAssignedGroups = (groups: string[], maxWidth: string = 'max-w-48') => {
    if (groups.length === 0) return <span className="text-gray-400">None</span>;
    
    // For this prototype, show first 2-3 groups then +count More
    const maxVisible = 3;
    const visibleGroups = groups.slice(0, maxVisible);
    const remainingCount = groups.length - visibleGroups.length;
    
    return (
      <div className={`${maxWidth}`}>
        <span className="text-gray-600">
          {visibleGroups.join(', ')}
          {remainingCount > 0 && (
            <span 
              className="text-gray-600"
              title={`Full list: ${groups.join(', ')}`}
            >
               +{remainingCount} More
            </span>
          )}
        </span>
      </div>
    );
  };

  const renderScope = (documents: string[] = [], workflows: string[] = []) => {
    const docCount = documents.length;
    const workflowCount = workflows.length;
    
    if (docCount === 0 && workflowCount === 0) {
      return <span className="text-gray-400">None</span>;
    }
    
    let scopeText = '';
    if (docCount > 0 && workflowCount > 0) {
      scopeText = `${docCount} Document${docCount > 1 ? 's' : ''}, ${workflowCount} Workflow${workflowCount > 1 ? 's' : ''}`;
    } else if (docCount > 0) {
      scopeText = `${docCount} Document${docCount > 1 ? 's' : ''}`;
    } else if (workflowCount > 0) {
      scopeText = `${workflowCount} Workflow${workflowCount > 1 ? 's' : ''}`;
    }
    
    const fullDetails = [
      ...(docCount > 0 ? [`Documents: ${documents.join(', ')}`] : []),
      ...(workflowCount > 0 ? [`Workflows: ${workflows.join(', ')}`] : [])
    ].join('\n');
    
    return (
      <span 
        className="text-gray-600"
        title={fullDetails}
      >
        {scopeText}
      </span>
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const renderStatusToggle = (filter: Filter) => {
    return (
      <button
        onClick={() => toggleFilterStatus(filter.id)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          filter.enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            filter.enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    );
  };
  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={`flex-1 bg-gray-50 transition-all duration-300 ${showCreatePanel ? 'mr-96' : ''}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Custom Filters</h1>
            </div>
            <button
              onClick={handleCreateFilter}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Custom Filter</span>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label.toUpperCase()}
                </button>
              ))}
            </nav>
          </div>

          {/* Filters List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {totalItems === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Plus className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No custom filters yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first custom filter for {activeTab}.
                </p>
                <button
                  onClick={handleCreateFilter}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Filter
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 w-1/3">Name</th>
                        {activeTab === 'templates' && (
                          <>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 w-32">Filter Type</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 w-40">Scope</th>
                          </>
                        )}
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Assigned Groups</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 w-24">Status</th>
                        <th className="w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {currentItems.map((filter) => (
                        <tr key={filter.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900" title={filter.name}>
                              {filter.name}
                            </div>
                          </td>
                          {activeTab === 'templates' && (
                            <>
                              <td className="py-4 px-4">
                                <div className="flex items-center space-x-2">
                                  {filter.filterType === 'people' ? (
                                    <Users className="w-4 h-4 text-blue-500" />
                                  ) : (
                                    <FileText className="w-4 h-4 text-green-500" />
                                  )}
                                  <span className="text-gray-600 capitalize">
                                    {filter.filterType || 'people'}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                {renderScope(filter.selectedDocuments, filter.selectedWorkflows)}
                              </td>
                            </>
                          )}
                          <td className="py-4 px-4">
                            {renderAssignedGroups(filter.targetGroups, 'max-w-64')}
                          </td>
                          <td className="py-4 px-4">
                            {renderStatusToggle(filter)}
                          </td>
                          <td className="py-4 px-4">
                            <div className="relative">
                              <button
                                onClick={() => handleDropdownToggle(filter.id)}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                              >
                                <MoreVertical className="w-4 h-4 text-gray-500" />
                              </button>
                              
                              {activeDropdown === filter.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                  <div className="py-1">
                                    <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                      <Info className="w-4 h-4" />
                                      <span>View Info</span>
                                    </button>
                                    <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                      <Edit className="w-4 h-4" />
                                      <span>Edit</span>
                                    </button>
                                    <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                      <Trash2 className="w-4 h-4" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination Controls */}
                <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span>Rows per page:</span>
                    <div className="relative">
                      <select
                        value={itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                        className="appearance-none bg-white border-none text-gray-600 pr-6 focus:outline-none cursor-pointer"
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                      <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  <span>
                    {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className={`p-1 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900 cursor-pointer'}`}
                    >
                      <span className="text-lg">⟪</span>
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-1 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900 cursor-pointer'}`}
                    >
                      <span className="text-lg">⟨</span>
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`p-1 ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900 cursor-pointer'}`}
                    >
                      <span className="text-lg">⟩</span>
                    </button>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className={`p-1 ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900 cursor-pointer'}`}
                    >
                      <span className="text-lg">⟫</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Create Filter Panel */}
      {showCreatePanel && (
        <CreateCustomFilterPanel
          activeTab={activeTab}
          onClose={() => setShowCreatePanel(false)}
          onSave={() => {
            setShowCreatePanel(false);
            // Handle save logic here
          }}
        />
      )}

      {/* Backdrop for dropdown */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
};