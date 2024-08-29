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
          sx={{
            width: "140px",
            "& .MuiOutlinedInput-root":{
              fontSize: "14px",
              height: "38px",
              border: "1px solid"
            },
          }}
          value={value} // Pass the original value prop (Day.js object or date string)
          onChange={(newValue) => {
            onChange({ target: { name, value: newValue } });
          }}
          inputFormat="ddd MMM DD YYYY HH:mm:ss ZZ" // Specify the input format
          renderInput={(params) => (
            <TextField {...params} size="small" sx={{fontSize: 14}}/>
          )}
        />
      </LocalizationProvider>
    );
  };
export default BasicDateField;