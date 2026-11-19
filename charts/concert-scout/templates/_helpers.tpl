{{/* Name of the Workflow object. */}}
{{- define "concert-scout.name" -}}
{{- default .Release.Name .Values.workflow.name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/* Labels of every object. Not covered by the AWP digest, so Helm may change them freely. */}}
{{- define "concert-scout.labels" -}}
app.kubernetes.io/name: concert-scout
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version }}
{{- end -}}

{{/*
An AWP expression such as ${{ inputs.sources }}. Helm would read the braces as a template
action, so the opening braces are emitted as a string.
*/}}
{{- define "concert-scout.expr" -}}
${{ "{{" }} {{ . }} }}
{{- end -}}
