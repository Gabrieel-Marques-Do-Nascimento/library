import { Param, SourceType } from '../models';

export function stringifySource(source: SourceType) {
  switch (source) {
    case SourceType.any:
      return '';
    case SourceType.var_any:
      return 'var';
    case SourceType.var_global:
      return 'global var';
    case SourceType.var_local:
      return 'local var';
    case SourceType.literal:
      return 'literal';
  }
}

export function stringifyWithColon(p: Param) {
  return [[stringifySource(p.source), p.name].filter(Boolean).join(' '), p.type]
    .filter(Boolean)
    .join(': ');
}

export function braceify(value: string, braces: '[]' | '()') {
  return `${braces[0]}${value}${braces[1]}`;
}

export function stringify(
  params: Param[],
  sep: ' ' | ', ',
  mapFn: (p: Param) => string = stringifyWithColon
): string {
  return params.map(mapFn).join(sep);
}