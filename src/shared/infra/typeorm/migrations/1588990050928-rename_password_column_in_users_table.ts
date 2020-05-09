import { MigrationInterface, QueryRunner } from 'typeorm';

export default class RenamePasswordColumnInUsersTable1588990050928
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameColumn('users', 'password', 'password_hash');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.renameColumn('users', 'password_hash', 'password');
  }
}
