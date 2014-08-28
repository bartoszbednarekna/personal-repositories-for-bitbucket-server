package org.networkedassets.atlassian.stash.personalstash.repositories;

import java.util.List;

import com.atlassian.stash.repository.Repository;
import com.atlassian.stash.user.StashUser;
import com.atlassian.stash.util.Page;
import com.atlassian.stash.util.PageRequest;

public interface PersonalRepositoriesService {

	PersonalRepository addPersonalRepository(StashUser user, Repository repo);

	List<PersonalRepository> addUserPersonalRepositories(StashUser user,
			Iterable<? extends Repository> repositories);

	Page<Owner> getPersonalRepositoriesOwners(PageRequest pageRequest, SortCriteria sortBy);

	List<PersonalRepository> getUserPersonalRepositories(int userId);

	void deletePersonalRepository(Repository repo);

	int getOwnersCount();
	
	void purge();
	
	void updateRepositorySize(Repository repo);

	void deletePersonalRepositoryOwner(StashUser deletedUser);

}
