use PHPUnit\Framework\TestCase;

class AuthTest extends TestCase {
    public function testPasswordHashing() {
        $password = "securepassword";
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        $this->assertTrue(password_verify($password, $hashedPassword));
    }
}
