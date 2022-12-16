export enum CareType {
  Message = 'Message',
  FaceToFace = 'FaceToFace',
  Call = 'Call',
  Visit = 'Visit'
}

export enum CarePriority {
  Good = 'Good',
  Normal = 'Normal',
  Warning = 'Warning'
}

export enum DateFilterSet {
  Current,
  TwoMonthAgo,
  FourMonthAgo,
  SixMonthAgo,
  LastYear
}
