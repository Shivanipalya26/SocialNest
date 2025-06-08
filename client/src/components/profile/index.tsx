'use client';

import { useDashboardStore } from '@/store/DashboardStore/useDashboardStore';
import React from 'react';
import Dashboard from '../dashboard';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '../ui/drawer';
import UserProfile from '../userProfile';
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import LogoutButton from '../Buttons/LogoutButton';
import { ScrollArea } from '../ui/scroll-area';
import { ChartContainer } from '../ui/chart';
import XUserDetails from '../xUserDetails';
import LinkedinUserDetails from '../linkedinUserDetails';

export function Profile() {
  const { fetchDashboardData, dashboardData } = useDashboardStore();

  React.useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Dummy LinkedIn profile data
  // const linkedInProfile = {
  //   name: 'Shivani Palya',
  //   headline: 'Software Engineer',
  //   profileImageUrl: 'https://randomuser.me/api/portraits',
  //   connections: 500,
  // };

  return (
    <Drawer>
      <DrawerTrigger>
        <UserProfile />
      </DrawerTrigger>
      <DrawerContent className="h-[90vh] flex flex-col">
        <div className="px-4 pt-3">
          <h2 className="font-ClashDisplayMedium text-2xl text-orange-500">Profile Dashboard</h2>
          <p className="text-muted-foreground text-sm font-ClashDisplayRegular">
            Analytics overview for your connected platforms and posting activity.
          </p>
        </div>
        <ScrollArea className="p-4">
          <div className="space-y-4 my-8">
            <Dashboard />
            <div className="border-none shadow-none bg-transparent">
              <h2 className="font-ClashDisplayMedium py-4">Posts Across Platforms</h2>

              <div>
                {dashboardData?.monthlyData ? (
                  <ChartContainer
                    config={{
                      Twitter: {
                        label: 'X (Twitter)',
                        color: '#1DA1F2',
                      },
                      LinkedIn: {
                        label: 'LinkedIn',
                        color: '#0077B5',
                      },
                      Instagram: {
                        label: 'Instagram',
                        color: '#E1306C',
                      },
                    }}
                    className="h-[350px] w-full"
                  >
                    <BarChart
                      data={dashboardData.monthlyData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
                      barGap={6}
                    >
                      <XAxis
                        dataKey="month"
                        tick={{ fill: '#888', fontSize: 12 }}
                        axisLine={{ stroke: '#ccc' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: '#888', fontSize: 12 }}
                        axisLine={{ stroke: '#ccc' }}
                        tickLine={false}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 rounded-lg shadow-lg text-sm border border-gray-200">
                                <p className="font-bold mb-2">{label}</p>
                                {payload.map((entry, index) => (
                                  <p key={index} className="text-gray-700">
                                    {entry.name === 'X (Twitter)' && '🐦 '}
                                    {entry.name === 'LinkedIn' && '💼 '}
                                    {entry.name === 'Instagram' && '📸 '}
                                    <span className="font-semibold">{entry.name}</span>:{' '}
                                    {entry.value} posts
                                  </p>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />

                      <Legend verticalAlign="top" height={36} />
                      <Bar dataKey="x" name="X (Twitter)" fill="#1DA1F2" radius={[4, 4, 0, 0]} />
                      <Bar
                        dataKey="linkedin"
                        name="LinkedIn"
                        fill="#0077B5"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="instagram"
                        name="Instagram"
                        fill="#E1306C"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div>
                    <p className="text-center text-muted-foreground border-2 border-secondary rounded-lg p-4 font-ClashDisplayMedium">
                      Create posts on your connected platforms to see insights
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="">
              <p className="font-ClashDisplayMedium py-4">Connected Accounts</p>
              <div className="grid grid-cols-2 gap-2">
                {dashboardData?.xUserDetails && <XUserDetails dashboardData={dashboardData} />}
                <LinkedinUserDetails />
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="absolute backdrop-blur-3xl bottom-4 right-4">
          <LogoutButton />
        </div>

        <DrawerClose className="absolute top-2 right-2">
          <Button variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
}
