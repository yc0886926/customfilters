import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { ConditionBuilderModal } from './ConditionBuilderModal';
import { TargetGroupsDropdown } from './TargetGroupsDropdown';

interface CreateCustomFilterPanelProps {
  activeTab: 'people' | 'applicants' | 'templates';
  onClose: () => void;
  onSave: () => void;
}

export const CreateCustomFilterPanel: React.FC<CreateCustomFilterPanelProps> = ({
  activeTab,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [conditions, setConditions] = useState<any[]>([]);
  const [targetGroups, setTargetGroups] = useState<string[]>([]);
  const [enabled, setEnabled] = useState(true);
  const [showConditionBuilder, setShowConditionBuilder] = useState(false);
  const [showTargetGroups, setShowTargetGroups] = useState(false);

  const getTabLabel = () => {
    switch (activeTab) {
      case 'people': return 'People';
      case 'applicants': return 'Applicants';
      case 'templates': return 'Templates';
      default: return 'People';
    }
  };

  const handleSave = () => {
    // Validation and save logic here
    onSave();
  };

  return (
    <>
      <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-lg z-30">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Create Custom Filter for {getTabLabel()}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter filter name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Conditions Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conditions
            </label>
            <button
              onClick={() => setShowConditionBuilder(true)}
              className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-500">
                {conditions.length === 0 ? 'Add conditions' : `${conditions.length} condition(s) added`}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Target Groups Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Groups
            </label>
            <button
              onClick={() => setShowTargetGroups(!showTargetGroups)}
              className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-500">
                {targetGroups.length === 0 ? 'Select target groups' : `${targetGroups.length} group(s) selected`}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Target Groups Dropdown */}
            {showTargetGroups && (
              <TargetGroupsDropdown
                selectedGroups={targetGroups}
                onSelectionChange={setTargetGroups}
                onClose={() => setShowTargetGroups(false)}
              />
            )}
          </div>

          {/* Enable Filter Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Enable Filter
            </label>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                name.trim()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Create
            </button>
          </div>
        </div>
      </div>

      {/* Condition Builder Modal */}
      {showConditionBuilder && (
        <ConditionBuilderModal
          conditions={conditions}
          onConditionsChange={setConditions}
          onClose={() => setShowConditionBuilder(false)}
        />
      )}
    </>
  );
};