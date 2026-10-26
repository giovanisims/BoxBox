export interface JolpicaDriverDto {
  driverId: string;
  permanentNumber?: string;
  code?: string;
  url?: string;
  givenName: string;
  familyName: string;
  dateOfBirth?: string;
  nationality: string;
}

export interface JolpicaDriverTableDto {
  driverId?: string;
  Drivers: JolpicaDriverDto[];
}

export interface JolpicaMRDataDto {
  limit: string;
  offset: string;
  total: string;
  DriverTable: JolpicaDriverTableDto;
}

export interface JolpicaResponseDto {
  MRData: JolpicaMRDataDto;
}
