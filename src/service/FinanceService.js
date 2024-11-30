import apiClient from './ApiClient';

export default {
    getTransactions(startDate, endDate) {
        return apiClient.get('/finance/transactions', {
            params: { start_date: startDate, end_date: endDate }
        });
    },
    getInvoices() {
        return apiClient.get('/finance/invoices');
    },
    createInvoice(invoice) {
        return apiClient.post('/finance/invoices', invoice);
    },
    getFinancialSummary() {
        return apiClient.get('/finance/financial-summary');
    }
};