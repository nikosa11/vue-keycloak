// transactions.js
export const transactionsData = [
    {
      id: 'TRX-2024-001',
      date: '2024-01-15T10:30:00',
      description: 'Πληρωμή για καμπάνια Instagram',
      amount: -1500.00,
      status: 'Ολοκληρώθηκε',
      paymentMethod: 'Πιστωτική Κάρτα',
      details: {
        campaign: 'Summer Collection 2024',
        influencer: 'John Doe',
        platform: 'Instagram'
      }
    },
    {
      id: 'TRX-2024-002',
      date: '2024-01-20T14:15:00',
      description: 'Είσπραξη από Brand X',
      amount: 2800.00,
      status: 'Ολοκληρώθηκε',
      paymentMethod: 'Τραπεζική Μεταφορά',
      details: {
        campaign: 'Product Launch 2024',
        brand: 'Brand X',
        platform: 'YouTube'
      }
    },
    {
      id: 'TRX-2024-003',
      date: '2024-02-01T09:45:00',
      description: 'Πληρωμή για καμπάνια TikTok',
      amount: -750.00,
      status: 'Σε Εξέλιξη',
      paymentMethod: 'PayPal',
      details: {
        campaign: 'Valentine\'s Day Special',
        influencer: 'Jane Smith',
        platform: 'TikTok'
      }
    },
    {
      id: 'TRX-2024-004',
      date: '2024-02-05T16:20:00',
      description: 'Επιστροφή χρημάτων',
      amount: 300.00,
      status: 'Ολοκληρώθηκε',
      paymentMethod: 'Πιστωτική Κάρτα',
      details: {
        campaign: 'New Year Campaign',
        reason: 'Partial Refund',
        originalTransaction: 'TRX-2024-001'
      }
    },
    {
      id: 'TRX-2024-005',
      date: '2024-02-10T11:30:00',
      description: 'Πληρωμή για καμπάνια Facebook',
      amount: -2000.00,
      status: 'Ακυρώθηκε',
      paymentMethod: 'Τραπεζική Μεταφορά',
      details: {
        campaign: 'Spring Collection 2024',
        influencer: 'Mike Johnson',
        platform: 'Facebook'
      }
    },
    {
      id: 'TRX-2024-006',
      date: '2024-02-15T13:45:00',
      description: 'Είσπραξη από Brand Y',
      amount: 3500.00,
      status: 'Ολοκληρώθηκε',
      paymentMethod: 'PayPal',
      details: {
        campaign: 'Brand Y Promotion',
        brand: 'Brand Y',
        platform: 'Multiple'
      }
    },
    {
      id: 'TRX-2024-007',
      date: '2024-02-20T15:00:00',
      description: 'Μηνιαία συνδρομή Premium',
      amount: -49.99,
      status: 'Ολοκληρώθηκε',
      paymentMethod: 'Πιστωτική Κάρτα',
      details: {
        type: 'Subscription',
        plan: 'Premium',
        period: 'February 2024'
      }
    },
    {
      id: 'TRX-2024-008',
      date: '2024-02-25T10:00:00',
      description: 'Πληρωμή για καμπάνια YouTube',
      amount: -3000.00,
      status: 'Σε Εξέλιξη',
      paymentMethod: 'Τραπεζική Μεταφορά',
      details: {
        campaign: 'Tech Review Series',
        influencer: 'Sarah Wilson',
        platform: 'YouTube'
      }
    },
    {
      id: 'TRX-2024-009',
      date: '2024-03-01T09:15:00',
      description: 'Έκτακτη πληρωμή',
      amount: -500.00,
      status: 'Ολοκληρώθηκε',
      paymentMethod: 'PayPal',
      details: {
        type: 'Extra Service',
        description: 'Story Highlight Creation',
        platform: 'Instagram'
      }
    },
    {
      id: 'TRX-2024-010',
      date: '2024-03-05T14:30:00',
      description: 'Είσπραξη από Brand Z',
      amount: 4500.00,
      status: 'Σε Εξέλιξη',
      paymentMethod: 'Τραπεζική Μεταφορά',
      details: {
        campaign: 'Summer Launch 2024',
        brand: 'Brand Z',
        platform: 'Multiple'
      }
    }
  ];
  
  // Στατιστικά Συναλλαγών
  export const transactionStats = {
    totalTransactions: transactionsData.length,
    totalIncome: transactionsData.reduce((sum, trx) => trx.amount > 0 ? sum + trx.amount : sum, 0),
    totalExpenses: Math.abs(transactionsData.reduce((sum, trx) => trx.amount < 0 ? sum + trx.amount : sum, 0)),
    statusDistribution: {
      completed: transactionsData.filter(trx => trx.status === 'Ολοκληρώθηκε').length,
      pending: transactionsData.filter(trx => trx.status === 'Σε Εξέλιξη').length,
      cancelled: transactionsData.filter(trx => trx.status === 'Ακυρώθηκε').length
    },
    paymentMethodDistribution: {
      card: transactionsData.filter(trx => trx.paymentMethod === 'Πιστωτική Κάρτα').length,
      bank: transactionsData.filter(trx => trx.paymentMethod === 'Τραπεζική Μεταφορά').length,
      paypal: transactionsData.filter(trx => trx.paymentMethod === 'PayPal').length
    }
  };
  
  // Βοηθητικές συναρτήσεις για φιλτράρισμα
  export const transactionFilters = {
    byDateRange: (startDate, endDate) => {
      return transactionsData.filter(trx => {
        const trxDate = new Date(trx.date);
        return trxDate >= startDate && trxDate <= endDate;
      });
    },
    byStatus: (status) => {
      return transactionsData.filter(trx => trx.status === status);
    },
    byPaymentMethod: (method) => {
      return transactionsData.filter(trx => trx.paymentMethod === method);
    },
    byAmount: (minAmount, maxAmount) => {
      return transactionsData.filter(trx => 
        Math.abs(trx.amount) >= minAmount && Math.abs(trx.amount) <= maxAmount
      );
    }
  };