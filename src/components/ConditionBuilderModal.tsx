import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
  logic?: 'AND' | 'OR';
}

interface ConditionBuilderModalProps {
  conditions: Condition[];
  onConditionsChange: (conditions: Condition[]) => void;
  onClose: () => void;
}

export const ConditionBuilderModal: React.FC<ConditionBuilderModalProps> = ({
  conditions,
  onConditionsChange,
  onClose
}) => {
  const [localConditions, setLocalConditions] = useState<Condition[]>(
    conditions.length > 0 ? conditions : [{ id: '1', field: '', operator: '', value: '', logic: 'AND' }]
  );

  const fields = [
    'Name', 'Email', 'Department', 'Title', 'Status', 'Hiring Date', 'Location', 'Manager', 'Employee Type'
  ];

  const operators = [
    'equals', 'not equals', 'contains', 'does not contain', 'starts with', 'ends with', 
    'is empty', 'is not empty', 'greater than', 'less than', 'between'
  ];

  const addCondition = () => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      field: '',
      operator: '',
      value: '',
      logic: 'AND'
    };
    setLocalConditions([...localConditions, newCondition]);
  };

  const removeCondition = (id: string) => {
    setLocalConditions(localConditions.filter(c => c.id !== id));
  };

  const updateCondition = (id: string, updates: Partial<Condition>) => {
    setLocalConditions(localConditions.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ));
  };

  const handleSave = () => {
    onConditionsChange(localConditions.filter(c => c.field && c.operator));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Condition Builder</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {localConditions.map((condition, index) => (
              <div key={condition.id} className="space-y-3">
                {index > 0 && (
                  <div className="flex items-center space-x-2">
                    <select
                      value={condition.logic}
                      onChange={(e) => updateCondition(condition.id, { logic: e.target.value as 'AND' | 'OR' })}
                      className="px-3 py-1 border border-gray-300 rounded text-sm font-medium bg-gray-50"
                    >
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                    </select>
                  </div>
                )}
                
                <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    {/* Field */}
                    <select
                      value={condition.field}
                      onChange={(e) => updateCondition(condition.id, { field: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select field</option>
                      {fields.map(field => (
                        <option key={field} value={field}>{field}</option>
                      ))}
                    </select>

                    {/* Operator */}
                    <select
                      value={condition.operator}
                      onChange={(e) => updateCondition(condition.id, { operator: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select operator</option>
                      {operators.map(operator => (
                        <option key={operator} value={operator}>{operator}</option>
                      ))}
                    </select>

                    {/* Value */}
                    <input
                      type="text"
                      value={condition.value}
                      onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                      placeholder="Enter value"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {localConditions.length > 1 && (
                    <button
                      onClick={() => removeCondition(condition.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addCondition}
            className="mt-4 flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Condition</span>
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Conditions
          </button>
        </div>
      </div>
    </div>
  );
};