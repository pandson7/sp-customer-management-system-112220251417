import React, { useState } from 'react';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import CustomerDetail from './components/CustomerDetail';
import { Customer } from './services/customerService';
import './App.css';

type View = 'list' | 'create' | 'edit' | 'detail';

function App() {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCurrentView('detail');
  };

  const handleCreateCustomer = () => {
    setSelectedCustomer(null);
    setCurrentView('create');
  };

  const handleEditCustomer = () => {
    setCurrentView('edit');
  };

  const handleSaveCustomer = () => {
    setCurrentView('list');
    setSelectedCustomer(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDeleteCustomer = () => {
    setCurrentView('list');
    setSelectedCustomer(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancel = () => {
    if (currentView === 'edit' && selectedCustomer) {
      setCurrentView('detail');
    } else {
      setCurrentView('list');
      setSelectedCustomer(null);
    }
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedCustomer(null);
  };

  return (
    <div className="App">
      {currentView === 'list' && (
        <CustomerList
          onSelectCustomer={handleSelectCustomer}
          onCreateCustomer={handleCreateCustomer}
          refreshTrigger={refreshTrigger}
        />
      )}

      {(currentView === 'create' || currentView === 'edit') && (
        <CustomerForm
          customer={currentView === 'edit' ? selectedCustomer || undefined : undefined}
          onSave={handleSaveCustomer}
          onCancel={handleCancel}
        />
      )}

      {currentView === 'detail' && selectedCustomer && (
        <CustomerDetail
          customer={selectedCustomer}
          onEdit={handleEditCustomer}
          onDelete={handleDeleteCustomer}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
}

export default App;
