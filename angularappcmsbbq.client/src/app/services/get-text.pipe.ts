import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getText'
})
export class GetTextPipe implements PipeTransform {

  transform(text: string, length: number): string {

    if (text.length > length) {
      return text.substring(0, length);
    } else {
      return text;
    }
  }

}
