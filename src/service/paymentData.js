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
  
  // Στατιστικά στοιχεία
  export const monthlyStats = {
    totalIncome: 15250.50,
    totalExpenses: 8750.25,
    pendingPayments: 2500.00,
    successfulTransactions: 45,
    failedTransactions: 3,
    averageTransactionValue: 338.90,
    mostUsedPaymentMethod: 'Visa',
    recentActivityCount: 12
  };
  
  // Διαμορφώσεις για τύπους πληρωμών
  export const paymentTypesConfig = {
    visa: {
      name: 'Visa',
      icon: 'pi pi-credit-card',
      bgClass: 'bg-blue-100 text-blue-500',
      maxLimit: 10000,
      processingFee: 0.029
    },
    mastercard: {
      name: 'Mastercard',
      icon: 'pi pi-credit-card',
      bgClass: 'bg-orange-100 text-orange-500',
      maxLimit: 10000,
      processingFee: 0.029
    },
    amex: {
      name: 'American Express',
      icon: 'pi pi-credit-card',
      bgClass: 'bg-purple-100 text-purple-500',
      maxLimit: 15000,
      processingFee: 0.034
    },
    paypal: {
      name: 'PayPal',
      icon: 'pi pi-paypal',
      bgClass: 'bg-indigo-100 text-indigo-500',
      maxLimit: 5000,
      processingFee: 0.035
    },
    bankTransfer: {
      name: 'Τραπεζική Μεταφορά',
      icon: 'pi pi-bank',
      bgClass: 'bg-green-100 text-green-500',
      maxLimit: 50000,
      processingFee: 0.005
    }
  };
  
  // Καταστάσεις πληρωμών
  export const paymentStatusTypes = {
    pending: {
      label: 'Σε Εκκρεμότητα',
      severity: 'warning',
      icon: 'pi pi-clock',
      allowedActions: ['cancel', 'edit', 'remind']
    },
    processing: {
      label: 'Σε Επεξεργασία',
      severity: 'info',
      icon: 'pi pi-spin pi-spinner',
      allowedActions: ['cancel']
    },
    completed: {
      label: 'Ολοκληρώθηκε',
      severity: 'success',
      icon: 'pi pi-check-circle',
      allowedActions: ['view', 'download', 'receipt']
    },
    failed: {
      label: 'Απέτυχε',
      severity: 'danger',
      icon: 'pi pi-times-circle',
      allowedActions: ['retry', 'edit', 'delete']
    },
    cancelled: {
      label: 'Ακυρώθηκε',
      severity: 'secondary',
      icon: 'pi pi-ban',
      allowedActions: ['delete', 'retry']
    },
    refunded: {
      label: 'Επιστροφή Χρημάτων',
      severity: 'help',
      icon: 'pi pi-replay',
      allowedActions: ['view', 'download']
    }
  };
  
  // Διαμορφώσεις για τιμολόγια
  export const invoiceConfig = {
    types: {
      invoice: {
        label: 'Τιμολόγιο',
        prefix: 'INV',
        requiresVAT: true,
        allowedPaymentMethods: ['bankTransfer', 'creditCard'],
        defaultDueDate: 30 // ημέρες
      },
      receipt: {
        label: 'Απόδειξη',
        prefix: 'RCP',
        requiresVAT: true,
        allowedPaymentMethods: ['all'],
        defaultDueDate: 0
      },
      proforma: {
        label: 'Προτιμολόγιο',
        prefix: 'PRF',
        requiresVAT: false,
        allowedPaymentMethods: ['none'],
        defaultDueDate: 15
      }
    },
    vatRates: {
      standard: 0.24,
      reduced: 0.13,
      superReduced: 0.06,
      zero: 0
    },
    paymentTerms: {
      immediate: {
        days: 0,
        description: 'Άμεση Πληρωμή'
      },
      net15: {
        days: 15,
        description: 'Καθαρή 15 ημερών'
      },
      net30: {
        days: 30,
        description: 'Καθαρή 30 ημερών'
      },
      net60: {
        days: 60,
        description: 'Καθαρή 60 ημερών'
      }
    }
  };
  
  // Κατηγορίες συναλλαγών
  export const transactionCategories = {
    subscription: {
      label: 'Συνδρομή',
      icon: 'pi pi-sync',
      color: 'var(--primary-color)'
    },
    service: {
      label: 'Υπηρεσίες',
      icon: 'pi pi-cog',
      color: 'var(--success-color)'
    },
    product: {
      label: 'Προϊόντα',
      icon: 'pi pi-shopping-cart',
      color: 'var(--warning-color)'
    },
    refund: {
      label: 'Επιστροφή Χρημάτων',
      icon: 'pi pi-replay',
      color: 'var(--danger-color)'
    },
    fee: {
      label: 'Χρεώσεις & Τέλη',
      icon: 'pi pi-percentage',
      color: 'var(--help-color)'
    }
  };
  
  // Ρυθμίσεις ειδοποιήσεων
  export const notificationSettings = {
    paymentReminders: {
      enabled: true,
      daysBeforeDue: [1, 3, 7],
      channels: ['email', 'sms']
    },
    paymentConfirmations: {
      enabled: true,
      channels: ['email']
    },
    failedPayments: {
      enabled: true,
      retryAttempts: 3,
      retryInterval: 24, // ώρες
      channels: ['email', 'sms']
    },
    newInvoices: {
      enabled: true,
      channels: ['email']
    }
  };
  
  // Διαμορφώσεις για αναφορές
  export const reportingConfig = {
    defaultDateRanges: {
      today: 'today',
      yesterday: 'yesterday',
      thisWeek: 'thisWeek',
      lastWeek: 'lastWeek',
      thisMonth: 'thisMonth',
      lastMonth: 'lastMonth',
      thisQuarter: 'thisQuarter',
      lastQuarter: 'lastQuarter',
      thisYear: 'thisYear',
      lastYear: 'lastYear'
    },
    exportFormats: ['pdf', 'excel', 'csv'],
    charts: {
      colors: {
        income: '#22C55E',
        expense: '#EF4444',
        pending: '#F59E0B'
      },
      defaultType: 'bar'
    }
  };
  
  // Ρυθμίσεις για αυτοματοποιήσεις
  export const automationRules = {
    recurringPayments: {
      enabled: true,
      frequencies: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
      maxAttempts: 3
    },
    invoiceGeneration: {
      enabled: true,
      autoNumbering: true,
      autoEmailDelivery: true
    },
    paymentReconciliation: {
      enabled: true,
      matchingCriteria: ['amount', 'reference', 'date'],
      autoMatchThreshold: 0.9
    }
  };