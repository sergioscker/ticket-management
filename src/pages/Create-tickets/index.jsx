//components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

export const CreateTicket = () => {
  const [department, setDepartment] = useState('');

  return (
    <div className="w-full flex flex-col gap-6 justify-center item=center p-6 mt-10">
      <form className="space-y-4 max-w-xl mx-auto">
        <h1 className="text-2xl text-left font-medium">Create New Ticket</h1>
        {/* input title */}
        <div>
          <Input type="text" placeholder="Title" className="w-[576px]" />
        </div>

        {/* textarea - description */}
        <div>
          <Textarea placeholder="Description" />
        </div>

        {/* select departament */}
        <div>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select departament" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select department</SelectLabel>
                <SelectItem value="est">IT</SelectItem>
                <SelectItem value="cst">Finance</SelectItem>
                <SelectItem value="mst">Designer</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* button */}
        <Button type="submit">Create Ticket</Button>
      </form>
    </div>
  );
};
