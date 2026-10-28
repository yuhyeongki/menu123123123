import { SchoolInfo } from '../types/meal';

export const DEFAULT_SCHOOLS: SchoolInfo[] = [
  {
    ATPT_OFCDC_SC_CODE: 'B10',
    ATPT_OFCDC_SC_NM: '서울특별시교육청',
    SD_SCHUL_CODE: '7010059',
    SCHUL_NM: '경기고등학교',
    SCHUL_KND_SC_NM: '고등학교',
    LCTN_SC_NM: '서울특별시',
    ORG_RDNMA: '서울특별시 강남구 영동대로 643',
    FOND_SC_NM: '공립',
    COEDU_SC_NM: '남'
  },
  {
    ATPT_OFCDC_SC_CODE: 'B10',
    ATPT_OFCDC_SC_NM: '서울특별시교육청',
    SD_SCHUL_CODE: '7010115',
    SCHUL_NM: '서울고등학교',
    SCHUL_KND_SC_NM: '고등학교',
    LCTN_SC_NM: '서울특별시',
    ORG_RDNMA: '서울특별시 서초구 효령로 214',
    FOND_SC_NM: '공립',
    COEDU_SC_NM: '남'
  },
  {
    ATPT_OFCDC_SC_CODE: 'B10',
    ATPT_OFCDC_SC_NM: '서울특별시교육청',
    SD_SCHUL_CODE: '7010178',
    SCHUL_NM: '한성과학고등학교',
    SCHUL_KND_SC_NM: '고등학교',
    LCTN_SC_NM: '서울특별시',
    ORG_RDNMA: '서울특별시 서대문구 통일로 279-79',
    FOND_SC_NM: '공립',
    COEDU_SC_NM: '남여공학'
  },
  {
    ATPT_OFCDC_SC_CODE: 'J10',
    ATPT_OFCDC_SC_NM: '경기도교육청',
    SD_SCHUL_CODE: '7530089',
    SCHUL_NM: '수원고등학교',
    SCHUL_KND_SC_NM: '고등학교',
    LCTN_SC_NM: '경기도',
    ORG_RDNMA: '경기도 수원시 팔달구 매산로 115',
    FOND_SC_NM: '사립',
    COEDU_SC_NM: '남'
  },
  {
    ATPT_OFCDC_SC_CODE: 'C10',
    ATPT_OFCDC_SC_NM: '부산광역시교육청',
    SD_SCHUL_CODE: '7150085',
    SCHUL_NM: '부산중앙고등학교',
    SCHUL_KND_SC_NM: '고등학교',
    LCTN_SC_NM: '부산광역시',
    ORG_RDNMA: '부산광역시 남구 용소로 78',
    FOND_SC_NM: '공립',
    COEDU_SC_NM: '남여공학'
  },
  {
    ATPT_OFCDC_SC_CODE: 'D10',
    ATPT_OFCDC_SC_NM: '대구광역시교육청',
    SD_SCHUL_CODE: '7240053',
    SCHUL_NM: '경북고등학교',
    SCHUL_KND_SC_NM: '고등학교',
    LCTN_SC_NM: '대구광역시',
    ORG_RDNMA: '대구광역시 수성구 청호로 300',
    FOND_SC_NM: '공립',
    COEDU_SC_NM: '남'
  },
  {
    ATPT_OFCDC_SC_CODE: 'G10',
    ATPT_OFCDC_SC_NM: '대전광역시교육청',
    SD_SCHUL_CODE: '7430048',
    SCHUL_NM: '대전고등학교',
    SCHUL_KND_SC_NM: '고등학교',
    LCTN_SC_NM: '대전광역시',
    ORG_RDNMA: '대전광역시 중구 대흥로 110',
    FOND_SC_NM: '공립',
    COEDU_SC_NM: '남'
  }
];

export const REGIONS = [
  { code: '', name: '전국 (전체)' },
  { code: 'B10', name: '서울특별시' },
  { code: 'C10', name: '부산광역시' },
  { code: 'D10', name: '대구광역시' },
  { code: 'E10', name: '인천광역시' },
  { code: 'F10', name: '광주광역시' },
  { code: 'G10', name: '대전광역시' },
  { code: 'H10', name: '울산광역시' },
  { code: 'I10', name: '세종특별자치시' },
  { code: 'J10', name: '경기도' },
  { code: 'K10', name: '강원특별자치도' },
  { code: 'M10', name: '충청북도' },
  { code: 'N10', name: '충청남도' },
  { code: 'P10', name: '전북특별자치도' },
  { code: 'Q10', name: '전라남도' },
  { code: 'R10', name: '경상북도' },
  { code: 'S10', name: '경상남도' },
  { code: 'T10', name: '제주특별자치도' }
];
