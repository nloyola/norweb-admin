import { ProjectKeywordUpdate } from '@app/models/projects/ProjectKeyword';
import { PropertyChangerProjectKeyword } from '../PropertyChanger';

type PropertyKeywordsProps = {
  keyword?: ProjectKeywordUpdate;
  open: boolean;
  onClose: (keyword?: ProjectKeywordUpdate) => void;
};

/**
 * A component that allows the user to update a project keyword.
 *
 * Opens up a dialog box that allows the user to modify the keyword settings.
 */
export function PropertyKeywordUpdate({ keyword, open, onClose }: PropertyKeywordsProps) {
  const handleKeywordUpdateClosed = (_propertyName: string, value?: ProjectKeywordUpdate) => {
    onClose(value);
  };

  if (open) {
    return (
      <PropertyChangerProjectKeyword
        propertyName={'keyword'}
        title={'Project: change settings'}
        label={'Keyword'}
        value={keyword}
        open={open}
        onClose={handleKeywordUpdateClosed}
      />
    );
  }

  return <></>;
}
