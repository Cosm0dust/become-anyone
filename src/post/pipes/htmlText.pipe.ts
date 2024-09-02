import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class HtmlValidationPipe implements PipeTransform {
   transform(value: any) {

      const isHtmlValid = this.validateHTML(value.text);

      if (!isHtmlValid) {
         throw new BadRequestException('Text contains invalid HTML.');
      }
      return value;
   }


   private validateHTML(html) {
      const allowedTags = ['a', 'code', 'i', 'strong'];
      const tagStack = [];

      const tagPattern = /<\/?([a-z]+)(\s+[^>]*)?>/gi;
      let match;

      while ((match = tagPattern.exec(html)) !== null) {
         const tagName = match[1].toLowerCase();

         if (!allowedTags.includes(tagName)) {
            continue;
         }

         if (match[0].startsWith('</')) {
            if (tagStack.length === 0 || tagStack[tagStack.length - 1] !== tagName) {
               return false;
            }
            tagStack.pop();
         } else {
            tagStack.push(tagName);
         }
      }

      return tagStack.length === 0;
   }
}
