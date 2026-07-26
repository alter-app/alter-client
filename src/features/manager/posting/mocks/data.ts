/**
 * API 미연동 단계용 목업 데이터.
 * 추후 `features/manager/posting/api/`의 axios 호출로 교체됩니다.
 */
import type {
  Application,
  Posting,
  Workspace,
} from '@/features/manager/posting/types/posting'

export const MOCK_WORKSPACES: Workspace[] = [
  { id: 1, businessName: '알터 강남점', businessType: '카페' },
  { id: 2, businessName: '알터 성수 로스터리', businessType: '카페' },
]

/** 업직종 키워드 — GET /manager/postings/available-keywords 대체 */
export const MOCK_KEYWORDS: string[] = [
  '카페',
  '홀서빙',
  '바리스타',
  '베이킹',
  '주방보조',
  '마감청소',
  '캐셔',
  '배달',
]

export const MOCK_POSTINGS: Posting[] = [
  {
    id: 1,
    workspaceId: 1,
    workspaceName: '알터 강남점',
    businessType: '카페',
    title: '주말 홀서빙 · 오후 마감조 구합니다',
    description:
      '주말 오후 마감조 홀서빙 아르바이트를 구합니다. 성실하게 근무하실 분 환영해요. 경험자 우대하며, 미경험자도 교육 후 근무 가능합니다.',
    keywords: ['카페', '홀서빙'],
    paymentType: 'HOURLY',
    payAmount: 12000,
    status: 'OPEN',
    applicantCount: 6,
    createdAt: '2026-07-20T09:00:00.000Z',
    schedules: [
      {
        id: 101,
        workingDays: ['SATURDAY', 'SUNDAY'],
        startTime: '17:00',
        endTime: '22:00',
        position: '홀서빙',
        positionsNeeded: 2,
      },
      {
        id: 102,
        workingDays: ['FRIDAY', 'SATURDAY'],
        startTime: '21:00',
        endTime: '23:00',
        position: '마감 청소',
        positionsNeeded: 1,
      },
    ],
  },
  {
    id: 2,
    workspaceId: 1,
    workspaceName: '알터 강남점',
    businessType: '카페',
    title: '평일 오픈 바리스타',
    description:
      '평일 오픈조 바리스타를 모집합니다. 바리스타 자격증 보유자 우대합니다.',
    keywords: ['카페', '바리스타'],
    paymentType: 'HOURLY',
    payAmount: 12500,
    status: 'OPEN',
    applicantCount: 3,
    createdAt: '2026-07-18T09:00:00.000Z',
    schedules: [
      {
        id: 201,
        workingDays: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
        startTime: '07:00',
        endTime: '12:00',
        position: '바리스타',
        positionsNeeded: 1,
      },
    ],
  },
  {
    id: 3,
    workspaceId: 2,
    workspaceName: '알터 성수 로스터리',
    businessType: '카페',
    title: '여름 성수기 주말 단기',
    description: '여름 성수기 주말 단기 아르바이트를 모집합니다.',
    keywords: ['카페', '베이킹'],
    paymentType: 'DAILY',
    payAmount: 90000,
    status: 'CLOSED',
    applicantCount: 4,
    createdAt: '2026-07-05T09:00:00.000Z',
    schedules: [
      {
        id: 301,
        workingDays: ['SATURDAY', 'SUNDAY'],
        startTime: '13:00',
        endTime: '18:00',
        position: '베이킹 보조',
        positionsNeeded: 2,
      },
    ],
  },
]

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 1,
    postingId: 1,
    workspaceId: 1,
    workspaceName: '알터 강남점',
    status: 'SUBMITTED',
    appliedAt: '2026-07-26T07:00:00.000Z',
    schedule: {
      workingDays: ['SATURDAY', 'SUNDAY'],
      startTime: '17:00',
      endTime: '22:00',
      position: '홀서빙',
    },
    description:
      '카페 홀 경험 1년 있습니다. 주말 마감조 성실하게 근무 가능하고, 바리스타 자격증도 보유하고 있어 음료 제조도 도와드릴 수 있습니다. 잘 부탁드립니다!',
    applicant: {
      name: '김지원',
      phoneNumber: '010-2345-6789',
      birthDate: '2001.03.14',
      gender: '여성',
      email: 'jiwon.k@example.com',
      certificates: [
        { name: '바리스타 2급', issuer: '한국커피협회', acquiredAt: '2023.08' },
        {
          name: '위생교육 이수증',
          issuer: '식품안전정보원',
          acquiredAt: '2024.02',
        },
      ],
    },
  },
  {
    id: 2,
    postingId: 2,
    workspaceId: 1,
    workspaceName: '알터 강남점',
    status: 'SHORTLISTED',
    appliedAt: '2026-07-26T04:00:00.000Z',
    schedule: {
      workingDays: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
      startTime: '09:00',
      endTime: '14:00',
      position: '바리스타',
    },
    description:
      '바리스타로 2년간 근무했습니다. 평일 오전 근무 가능하며 오픈 업무 경험이 많습니다.',
    applicant: {
      name: '이서준',
      phoneNumber: '010-3456-7890',
      birthDate: '1998.06.21',
      gender: '남성',
      email: 'seojun.lee@example.com',
      certificates: [
        { name: '바리스타 1급', issuer: '한국커피협회', acquiredAt: '2022.05' },
      ],
    },
  },
  {
    id: 3,
    postingId: 3,
    workspaceId: 2,
    workspaceName: '알터 성수 로스터리',
    status: 'ACCEPTED',
    appliedAt: '2026-07-25T09:00:00.000Z',
    schedule: {
      workingDays: ['SATURDAY', 'SUNDAY'],
      startTime: '13:00',
      endTime: '18:00',
      position: '베이킹 보조',
    },
    description:
      '베이커리 아르바이트 경험이 있어 빠르게 적응할 수 있습니다. 주말 오후 근무 가능합니다.',
    applicant: {
      name: '박하늘',
      phoneNumber: '010-8765-4321',
      birthDate: '1999.11.02',
      gender: '여성',
      email: 'haneul@example.com',
      certificates: [],
    },
  },
  {
    id: 4,
    postingId: 1,
    workspaceId: 1,
    workspaceName: '알터 강남점',
    status: 'REJECTED',
    appliedAt: '2026-07-24T09:00:00.000Z',
    schedule: {
      workingDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
      startTime: '18:00',
      endTime: '22:00',
      position: '마감조',
    },
    description: '평일 저녁 근무 가능합니다. 성실하게 근무하겠습니다.',
    applicant: {
      name: '정민재',
      phoneNumber: '010-1122-3344',
      birthDate: '2000.01.09',
      gender: '남성',
      email: 'minjae.j@example.com',
      certificates: [],
    },
  },
  {
    id: 5,
    postingId: 2,
    workspaceId: 1,
    workspaceName: '알터 강남점',
    status: 'CANCELLED',
    appliedAt: '2026-07-23T09:00:00.000Z',
    schedule: {
      workingDays: ['MONDAY', 'WEDNESDAY'],
      startTime: '07:00',
      endTime: '12:00',
      position: '바리스타',
    },
    description: '오전 근무 가능합니다.',
    applicant: {
      name: '최유나',
      phoneNumber: '010-5566-7788',
      birthDate: '2002.04.18',
      gender: '여성',
      email: 'yuna.choi@example.com',
      certificates: [],
    },
  },
  {
    id: 6,
    postingId: 3,
    workspaceId: 2,
    workspaceName: '알터 성수 로스터리',
    status: 'EXPIRED',
    appliedAt: '2026-07-20T09:00:00.000Z',
    schedule: {
      workingDays: ['SATURDAY'],
      startTime: '13:00',
      endTime: '18:00',
      position: '베이킹 보조',
    },
    description: '주말 단기 근무 희망합니다.',
    applicant: {
      name: '한소희',
      phoneNumber: '010-9900-1122',
      birthDate: '1997.09.30',
      gender: '여성',
      email: 'sohee.han@example.com',
      certificates: [],
    },
  },
]
