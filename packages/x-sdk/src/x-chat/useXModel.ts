import { XModelMessage, XModelParams, XModelResponse } from '../x-model';
import useXChat, { XChatConfig } from '.';

export default function useXModel(
  config: XChatConfig<XModelMessage, XModelMessage, XModelParams, XModelResponse>,
) {
  return useXChat<XModelMessage, XModelMessage, XModelParams, XModelResponse>(config);
}
