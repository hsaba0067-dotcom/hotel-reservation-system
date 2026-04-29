import { createBase44Client } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

export const base44 = createBase44Client({
  appId: appParams.appId,
  token: appParams.token,
});
