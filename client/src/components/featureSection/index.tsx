'use client';

import { useEffect, useState } from 'react';
import OrbitingCirclesWithIcon from '../OrbitingCirclesWithIcon';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Calendar } from '../ui/calendar';

const FeatureSection = () => {
  const [timeSlots, setTimeSlots] = useState([
    { enabled: true, startTime: '10:00 am', endTime: '3:00 pm' },
    { enabled: true, startTime: '4:00 pm', endTime: '9:00 pm' },
    { enabled: false, startTime: ' 11: 00 pm', endTime: '2:00 am' },
  ]);

  const [date, setDate] = useState<Date | undefined>(new Date());

  const data = [
    {
      name: 'A',
      pv: 4400,
    },
    {
      name: 'B',
      pv: 1398,
    },
    {
      name: 'C',
      pv: 9800,
    },
    {
      name: 'D',
      pv: 2908,
    },
    {
      name: 'E',
      pv: 4800,
    },
    {
      name: 'F',
      pv: 3800,
    },
    {
      name: 'G',
      pv: 7300,
    },
  ];

  const handleToggle = (index: number) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index].enabled = !newTimeSlots[index].enabled;
    setTimeSlots(newTimeSlots);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeSlots = timeSlots.map(slot => ({
        ...slot,
        enabled: !slot.enabled,
      }));
      setTimeSlots(newTimeSlots);
    }, 3000);
    return () => clearInterval(interval);
  }, [timeSlots]);
  return (
    <section>
      <div className="md:max-w-6xl mx-auto px-4 py-12 z-30 relative pt-28">
        <div className="p-6">
          <div className="flex text-5xl text-center justify-center py-2">why SocialNest?</div>
          <p className="text-sm text-center text-muted-foreground">No Hassle - Just one click!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-6xl">
          <Card className="p-3 rounded-3xl relative overflow-hidden h-[440px]">
            <div
              className={`rounded-lg text-base my-3 h-8 w-8 backdrop-blur-3xl text-neutral-800 bg-neutral-200 flex items-center justify-center`}
            >
              <span>01</span>
            </div>
            <h3 className="text-xl font-semibold my-2">Multiple Platform Support</h3>
            <p className="text-muted-foreground mb-8">
              Post to LinkedIn, Twitter, Instagram, and more from one central hub.
            </p>

            <div className="relative h-40 mt-auto">
              <OrbitingCirclesWithIcon />
            </div>
          </Card>

          <Card className="p-3 rounded-3xl relative overflow-hidden h-[440px]">
            <div
              className={`rounded-lg text-base my-3 h-8 w-8 backdrop-blur-3xl text-neutral-800 bg-neutral-200 flex items-center justify-center`}
            >
              <span>02</span>
            </div>
            <h3 className="text-xl font-semibold my-2">Scheduling and Instant Posting</h3>
            <p className="text-muted-foreground mb-8">
              Schedule posts for the future or publish them instantly without manual effort.
            </p>

            <div className="mt-12 ml-12 space-y-4 border-t border-l rounded-tl-3xl p-12 pr-1">
              {timeSlots.map((slot, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Switch
                    checked={slot.enabled}
                    onCheckedChange={() => handleToggle(index)}
                    className={cn(slot.enabled ? 'bg-emerald-500' : 'bg-neutral-200')}
                  />
                  <Input
                    value={slot.startTime}
                    className="max-w-[100px]"
                    readOnly
                    disabled={!slot.enabled}
                  />
                  <Input
                    value={slot.endTime}
                    className="max-w-[100px]"
                    readOnly
                    disabled={!slot.enabled}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-3 rounded-3xl relative overflow-hidden h-[440px]">
            <div
              className={`rounded-lg text-base my-3 h-8 w-8 backdrop-blur-3xl text-neutral-800 bg-neutral-200 flex items-center justify-center`}
            >
              <span>03</span>
            </div>

            <h3 className="text-xl font-semibold my-2">Visual Analytics Dashboard</h3>
            <p className="text-muted-foreground mb-6">
              Track performance metrics for each platform through an interactive, real-time
              analytics dashboard.
            </p>

            <div>
              <div className="flex items-start">
                <div>
                  <div className="w-48 border border-border shadow-sm rounded-xl px-2 py-3 text-sm text-muted-foreground font-medium space-y-2">
                    <div className="border border-border shadow-sm rounded-xl px-4 py-1">
                      <div className="flex justify-between">
                        <span>👍 Likes:</span> <span>100k</span>
                      </div>
                    </div>
                    <div className="border border-border shadow-sm rounded-xl px-4 py-1">
                      <div className="flex justify-between">
                        <span>👁️ Views:</span> <span>500k</span>
                      </div>
                    </div>
                    <div className="border border-border shadow-sm rounded-xl px-4 py-1">
                      <div className="flex justify-between">
                        <span>💬 Comments:</span> <span>10k</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative h-0 ml-[20px] md:ml-[-40px] overflow-visible">
                  <div className="scale-[0.55] origin-top">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  </div>
                </div>
              </div>

              <div className="h-20 pt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart width={300} height={100} data={data}>
                    <Line type="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
