export interface CreateUserDto {
  id: string;
  identificationNumber: string;
  firstName: string;
  lastName: string;
  history?: string;
  dateCreated: Date;
  dateUpdated: Date;
  deleted: boolean;
  dateDeleted?: Date;
}
