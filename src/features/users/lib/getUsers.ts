import { connectToMongoDB } from "../../../lib/mongodb";
import { User } from "../model/User";

export async function getUsers() {
    await connectToMongoDB();

    const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .lean();

    return users.map((user) => {
        const locations =
            (user.locations as Array<{ toString(): string }> | undefined) ?? [];

        return {
            id: user._id.toString(),
            firstName: user.firstName,
            secondName: user.secondName,
            phone: user.phone,
            email: user.email,
            role: user.role,
            organizationId: user.organizationId?.toString(),
            locations: locations.map((locationId) => locationId.toString()),
            departmentId: user.departmentId?.toString(),
            skills: user.skills,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    });
}
