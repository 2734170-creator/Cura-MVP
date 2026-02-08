
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext.tsx';
import Layout from './components/Layout.tsx';
import ProfileScreen from './screens/ProfileScreen.tsx';
import DeliveryScreen from './screens/DeliveryScreen.tsx';
import OrderDetailsScreen from './screens/OrderDetailsScreen.tsx';
import CancelOrderScreen from './screens/CancelOrderScreen.tsx';
import SupportScreen from './screens/SupportScreen.tsx';
import TicketDetailsScreen from './screens/TicketDetailsScreen.tsx';
import CreateTicketScreen from './screens/CreateTicketScreen.tsx';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Start directly on profile screen as requested */}
            <Route path="/" element={<Navigate to="/profile" replace />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/deliveries" element={<DeliveryScreen />} />
            <Route path="/order/:id" element={<OrderDetailsScreen />} />
            <Route path="/order/:id/cancel" element={<CancelOrderScreen />} />
            <Route path="/support" element={<SupportScreen />} />
            <Route path="/support/create" element={<CreateTicketScreen />} />
            <Route path="/support/ticket/:id" element={<TicketDetailsScreen />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;
