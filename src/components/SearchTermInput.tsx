import { IconButton, InputAdornment, TextField } from '@mui/material';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDebounce } from '@app/utils/utils';

type SearchTermInputProps = {
  initialInput: string | null;
  onChange: (input: string) => void;
};

export function SearchTermInput({ initialInput, onChange }: SearchTermInputProps) {
  const [input, setInput] = useState(initialInput || '');
  const debouncedInput = useDebounce(input, 400);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const clearSearch = () => {
    setInput('');
    onChange('');
  };

  useEffect(() => {
    if (debouncedInput !== '') {
      onChange(debouncedInput);
    }
  }, [debouncedInput]);

  return (
    <TextField
      label="Search"
      value={input}
      onChange={handleChange}
      fullWidth
      size="small"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="toggle password visibility" onMouseDown={clearSearch} edge="end">
              <HighlightOffSharpIcon />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
}
