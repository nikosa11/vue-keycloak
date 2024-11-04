// paymentData.js

export const paymentMethodsData = [
    {
      id: 1,
      type: 'Visa',
      lastDigits: '4242',
      expiry: '12/25',
      name: 'JOHN DOE',
      isDefault: true,
      icon: 'pi pi-credit-card',
      bgClass: 'bg-blue-100 text-blue-500'
    },
    {
      id: 2,
      type: 'Mastercard',
      lastDigits: '5555',
      expiry: '06/24',
      name: 'JOHN DOE',
      isDefault: false,
      icon: 'pi pi-credit-card',
      bgClass: 'bg-orange-100 text-orange-500'
    },
    {
      id: 3,
      type: 'American Express',
      lastDigits: '3782',
      expiry: '09/24',
      name: 'JANE SMITH',
      isDefault: false,
      icon: 'pi pi-credit-card',
      bgClass: 'bg-purple-100 text-purple-500'
    }
  ];
  
  export const transactionsHistoryData = [
    {
      id: 'TR001',
      date: '2024-03-01',
      type: 'payment',
      amount: -150.00,
      description: 'Μηνιαία Συνδρομή Premium',
      status: 'completed',
      paymentMethod: 'Visa (****4242)'
    },
    {
      id: 'TR002',
      date: '2024-03-05',
      type: 'income',
      amount: 1500.00,
      description: 'Πληρωμή από Campaign X',
      status: 'completed',
      paymentMethod: 'Τραπεζική Μεταφορά'
    }
  ];
  
  export const invoicesData = [
    {
      id: 'INV-2024-001',
      date: '2024-03-01',
      amount: 150.00,
      status: 'paid',
      type: 'Subscription',
      items: [
        {
          description: 'Premium Plan - Monthly Subscription',
          amount: 150.00,
          quantity: 1
        }
      ]
    },
    {
      id: 'INV-2024-002',
      date: '2024-03-05',
      amount: 1500.00,
      status: 'paid',
      type: 'Campaign',
      items: [
        {
          description: 'Social Media Campaign - March 2024',
          amount: 1200.00,
          quantity: 1
        },
        {
          description: 'Extra Posts',
          amount: 300.00,
          quantity: 2
        }
      ]
    },
    {
      id: 'INV-2024-003',
      date: '2024-03-10',
      amount: 2500.00,
      status: 'pending',
      type: 'Campaign',
      items: [
        {
          description: 'YouTube Campaign - Spring Collection',
          amount: 2500.00,
          quantity: 1
        }
      ]
    }
  ];
  
  export const receiptData = [
    {
      id: 'RCP-2024-001',
      invoiceId: 'INV-2024-001',
      date: '2024-03-01',
      amount: 150.00,
      paymentMethod: 'Visa (****4242)',
      status: 'completed'
    },
    {
      id: 'RCP-2024-002',
      invoiceId: 'INV-2024-002',
      date: '2024-03-05',
      amount: 1500.00,
      paymentMethod: 'Τραπεζική Μεταφορά',
      status: 'completed'
    }
  ];
  
  // Payment Types Configuration
  export const paymentTypesConfig = [
    { 
      name: 'Visa', 
      icon: 'pi pi-credit-card',
      bgClass: 'bg-blue-100 text-blue-500'
    },
    { 
      name: 'Mastercard', 
      icon: 'pi pi-credit-card',
      bgClass: 'bg-orange-100 text-orange-500'
    },
    { 
      name: 'American Express', 
      icon: 'pi pi-credit-card',
      bgClass: 'bg-purple-100 text-purple-500'
    },
    { 
      name: 'PayPal', 
      icon: 'pi pi-paypal',
      bgClass: 'bg-indigo-100 text-indigo-500'
    }
  ];
  
  // Payment Status Types
  export const paymentStatusTypes = {
    completed: {
      label: 'Ολοκληρώθηκε',
      severity: 'success'
    },
    pending: {
      label: 'Σε Εκκρεμότητα',
      severity: 'warning'
    },
    failed: {
      label: 'Απέτυχε',
      severity: 'danger'
    },
    refunded: {
      label: 'Επιστροφή Χρημάτων',
      severity: 'info'
    }
  };
  
  // Monthly Statistics
  export const monthlyStats = {
    totalIncome: 15000.00,
    totalExpenses: 3500.00,
    pendingPayments: 2500.00,
    successfulTransactions: 25,
    failedTransactions: 2,
    mostUsedPaymentMethod: 'Visa',
    averageTransactionValue: 750.00
  };
  
  // Payment Methods Summary
  export const paymentMethodsSummary = {
    totalActive: 3,
    defaultMethod: 'Visa (****4242)',
    methodsDistribution: {
      visa: 45,
      mastercard: 30,
      amex: 15,
      paypal: 10
    }
  };
  
  // Recent Activity
  export const recentActivityData = [
    {
      id: 'ACT001',
      type: 'payment_added',
      date: '2024-03-01T10:30:00',
      description: 'Νέα μέθοδος πληρωμής προστέθηκε: Visa ****4242'
    },
    {
      id: 'ACT002',
      type: 'payment_success',
      date: '2024-03-01T10:35:00',
      description: 'Επιτυχής πληρωμή: €150.00 για Premium Subscription'
    },
    {
      id: 'ACT003',
      type: 'invoice_generated',
      date: '2024-03-05T15:20:00',
      description: 'Νέο τιμολόγιο δημιουργήθηκε: INV-2024-002'
    }
  ];