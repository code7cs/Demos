import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customFileSize',
})
export class CustomFileSizePipe implements PipeTransform {
  transform(size: number, extensions: string = 'MB'): string {
    return (size / (1024 * 1024)).toFixed(2) + extensions;
  }
}
