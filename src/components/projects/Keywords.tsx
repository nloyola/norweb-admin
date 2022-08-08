import { keywordWeight, ProjectKeyword } from '@app/models/projects/ProjectKeyword';
import { Chip } from '@mui/material';
import { Box } from '@mui/system';

type KeywordsProps = {
  keywords: ProjectKeyword[];
  onClick: (kw: ProjectKeyword) => void;
  onDelete: (kw: ProjectKeyword) => void;
};

export function Keywords({ keywords, onClick, onDelete }: KeywordsProps) {
  return (
    <Box>
      {keywords.map((kw, index) => {
        const weight = keywordWeight(kw);

        const handleClicked = () => {
          onClick(kw);
        };
        const handleDelete = () => {
          onDelete(kw);
        };

        return (
          <Chip
            key={`${kw.name}-${index}`}
            label={`${kw.name} | ${weight}`}
            color="primary"
            sx={{ margin: '0.2rem' }}
            onClick={handleClicked}
            onDelete={handleDelete}
          />
        );
      })}
    </Box>
  );
}
