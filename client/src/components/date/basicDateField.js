// import * as React from 'react';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DateField } from '@mui/x-date-pickers/DateField';
// import { DatePicker } from '@mui/x-date-pickers';




// export default function BasicDateField({label}) {

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs} >
//         <DatePicker label={label}
//         size='small'
//         sx={{width: "100%" ,fontSize: 2}} />
//     </LocalizationProvider>
//   );
// }


import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { TextField } from "@mui/material";

const BasicDateField = ({ value, onChange, name }) => {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={value} // Pass the original value prop (Day.js object or date string)
          onChange={(newValue) => {
            onChange({ target: { name, value: newValue } });
          }}
          inputFormat="ddd MMM DD YYYY HH:mm:ss ZZ" // Specify the input format
          renderInput={(params) => (
            <TextField {...params} size="small" />
          )}
        />
      </LocalizationProvider>
    );
  };
export default BasicDateField;