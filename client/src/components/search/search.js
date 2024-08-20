import {
    FormControl,
    IconButton,
    InputAdornment,
    OutlinedInput,
  } from "@mui/material";
  import React from "react";
  import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
  
  function SearchBar() {
    return (
      <FormControl sx={{ width: "25ch" }} size="small" variant="outlined" className="search-bar">
        <OutlinedInput
          placeholder="Search"
          startAdornment={
            <InputAdornment position="start">
              <IconButton aria-label="toggle password visibility" edge="start">
                <SearchOutlinedIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    );
  }
  
  export default SearchBar;
  