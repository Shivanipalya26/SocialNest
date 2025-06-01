import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Input } from '../ui/input';

interface SchedulePostProps {
  scheduleDate: Date | null;
  setScheduleDate: (date: Date | null) => void;
  scheduleTime: string;
  setScheduleTime: (time: string | null) => void;
}

const SchedulePost = ({
  scheduleDate,
  setScheduleDate,
  scheduleTime,
  setScheduleTime,
}: SchedulePostProps) => {
  return (
    <div className="flex space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-[240px] justify-start text-left font-normal',
              !scheduleDate && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {scheduleDate ? format(scheduleDate, 'PPP') : <span>Pick a Date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 pt-1">
          <Calendar
            mode="single"
            selected={scheduleDate!}
            onSelect={date => setScheduleDate(date ?? null)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <Input
          type="time"
          value={scheduleTime}
          onChange={e => setScheduleTime(e.target.value)}
          className="w-[120px]"
        />
      </div>
    </div>
  );
};

export default SchedulePost;
