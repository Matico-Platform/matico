import {
  urlForSource,
  Source,
  useSWRAPI,
  SourceType,
  updateFeature,
} from "../utils/api";

export const useFeature = (
  source: Source,
  featureId: string | number | null,
  edit: boolean,
  format?: "json"|"csv"|"geojson"
) => {
  const baseUrl = urlForSource(source);

  const {
    data: feature,
    error,
    mutate,
  } = useSWRAPI( source && featureId  ? `${baseUrl}/data/${featureId}`: null, {
    params: {...source.parameters, include_metadata:false, format : format ?? 'json'},
    refreshInterval: 0,
  });


  const editFeature = (update: { [parameter: string]: any }) => {
    if (featureId) {
      updateFeature(source.id, featureId, update).then(() => {
        mutate();
      });
    }
  };

  return {
    feature,
    featureError: error,
    editable: source.type === SourceType.Dataset,
    updateFeature: editFeature,
    mutateFeature: mutate
  };
};
