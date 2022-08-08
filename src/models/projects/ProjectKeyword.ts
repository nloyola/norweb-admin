import { DomainEntity } from '@app/models';

export interface ProjectKeyword extends DomainEntity {
  readonly name: string;
  readonly weight: string;
}

export type ProjectKeywordAdd = Pick<ProjectKeyword, 'name' | 'weight'>;

export function keywordWeight(keyword: ProjectKeyword): number {
  return parseFloat(keyword.weight);
}
