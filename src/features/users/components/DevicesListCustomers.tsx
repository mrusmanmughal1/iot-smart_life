import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { useDevicesByCustomerId } from '../hooks';

const DevicesListCustomers = ({ customerId }: { customerId: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Devices List</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default DevicesListCustomers;
