import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProvder {
  parse(data: IParseMailTemplateDTO): Promise<string>;
}
