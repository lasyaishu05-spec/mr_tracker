import { useCallback, useEffect, useState } from 'react';
import { Download, FileJson, FileText } from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { LoadingSpinner } from '../utils/loaders';
import { showSuccess, showError } from '../utils/toast';
import { exportToPDF, exportToExcel } from '../utils/exports';

const getDefaultDateRange = () => ({
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
});

const Reports = () => {
  const [doctors, setDoctors] = useState([]);
  const [visits, setVisits] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(getDefaultDateRange);

  const fetchData = useCallback(async () => {
    try {
      const [doctorsRes, visitsRes, followupsRes] = await Promise.all([
        api.get('/doctors'),
        api.get('/visits'),
        api.get('/followups'),
      ]);
      setDoctors(doctorsRes.data.data || []);
      setVisits(visitsRes.data.data || []);
      setFollowups(followupsRes.data.data || []);
    } catch (error) {
      showError('Failed to load report data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const filterByDate = (data, dateField) => {
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      return itemDate >= start && itemDate <= end;
    });
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const filteredVisits = filterByDate(visits, 'visitDate');
  const filteredFollowups = filterByDate(followups, 'nextDate');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600 mt-1">Export data in various formats</p>
          </div>

          {/* Date Range Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Date Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Report Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Doctors Report */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Doctors Report</h3>
                <FileJson className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-600 mb-6">
                Export complete list of {doctors.length} doctors with contact information
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    try {
                      const columns = [
                        { key: 'id', label: 'ID' },
                        { key: 'name', label: 'Doctor Name' },
                        { key: 'hospitalName', label: 'Hospital' },
                        { key: 'specialization', label: 'Specialization' },
                        { key: 'phone', label: 'Phone' },
                        { key: 'email', label: 'Email' },
                      ];
                      exportToPDF(doctors, 'doctors_report', columns, 'Doctors Report');
                      showSuccess('Exported as PDF');
                    } catch {
                      showError('Export failed');
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={() => {
                    try {
                      const columns = [
                        { key: 'id', label: 'ID' },
                        { key: 'name', label: 'Doctor Name' },
                        { key: 'hospitalName', label: 'Hospital' },
                        { key: 'specialization', label: 'Specialization' },
                        { key: 'phone', label: 'Phone' },
                        { key: 'email', label: 'Email' },
                      ];
                      exportToExcel(doctors, 'doctors_report', columns);
                      showSuccess('Exported as Excel');
                    } catch {
                      showError('Export failed');
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-600 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Excel
                </button>
              </div>
            </div>

            {/* Visits Report */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Visits Report</h3>
                <FileJson className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600 mb-6">
                Export {filteredVisits.length} visits within the selected date range
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    try {
                      const columns = [
                        { key: 'id', label: 'Visit ID' },
                        { key: 'doctorName', label: 'Doctor' },
                        { key: 'hospitalName', label: 'Hospital' },
                        { key: 'visitDate', label: 'Visit Date' },
                        { key: 'status', label: 'Status' },
                        { key: 'samplesGiven', label: 'Samples' },
                      ];
                      exportToPDF(
                        filteredVisits.map(v => ({
                          ...v,
                          visitDate: new Date(v.visitDate).toLocaleDateString(),
                        })),
                        'visits_report',
                        columns,
                        `Visits Report (${dateRange.startDate} to ${dateRange.endDate})`
                      );
                      showSuccess('Exported as PDF');
                    } catch {
                      showError('Export failed');
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={() => {
                    try {
                      const columns = [
                        { key: 'id', label: 'Visit ID' },
                        { key: 'doctorName', label: 'Doctor' },
                        { key: 'hospitalName', label: 'Hospital' },
                        { key: 'visitDate', label: 'Visit Date' },
                        { key: 'status', label: 'Status' },
                        { key: 'samplesGiven', label: 'Samples' },
                      ];
                      exportToExcel(
                        filteredVisits.map(v => ({
                          ...v,
                          visitDate: new Date(v.visitDate).toLocaleDateString(),
                        })),
                        'visits_report',
                        columns
                      );
                      showSuccess('Exported as Excel');
                    } catch {
                      showError('Export failed');
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-600 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Excel
                </button>
              </div>
            </div>

            {/* Follow-ups Report */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Follow-ups Report</h3>
                <FileJson className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-gray-600 mb-6">
                Export {filteredFollowups.length} follow-ups within the selected date range
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    try {
                      const columns = [
                        { key: 'id', label: 'Follow-up ID' },
                        { key: 'nextDate', label: 'Next Date' },
                        { key: 'status', label: 'Status' },
                        { key: 'notes', label: 'Notes' },
                      ];
                      exportToPDF(
                        filteredFollowups.map(f => ({
                          ...f,
                          nextDate: new Date(f.nextDate).toLocaleDateString(),
                        })),
                        'followups_report',
                        columns,
                        `Follow-ups Report (${dateRange.startDate} to ${dateRange.endDate})`
                      );
                      showSuccess('Exported as PDF');
                    } catch {
                      showError('Export failed');
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={() => {
                    try {
                      const columns = [
                        { key: 'id', label: 'Follow-up ID' },
                        { key: 'nextDate', label: 'Next Date' },
                        { key: 'status', label: 'Status' },
                        { key: 'notes', label: 'Notes' },
                      ];
                      exportToExcel(
                        filteredFollowups.map(f => ({
                          ...f,
                          nextDate: new Date(f.nextDate).toLocaleDateString(),
                        })),
                        'followups_report',
                        columns
                      );
                      showSuccess('Exported as Excel');
                    } catch {
                      showError('Export failed');
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-600 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
